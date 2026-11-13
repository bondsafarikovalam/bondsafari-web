# Bond Safari – Initial Audit

Branch: `chore/aws-production-readiness`, created from `feat/BS-02` at commit `a5adb21`. Audit date: 2026-11-12.
Findings were recorded before any change, from a production build (`next build`) and `next start`.

## 1. Architecture (inspected, not assumed)

| Item | Finding |
|---|---|
| Framework | **Next.js 16.4.3, App Router**, React 19.3, TypeScript 5.7, Turbopack build |
| Rendering | Mixed: static pages (`○`), ISR pages with `revalidate = 300` (home, /activities, /courses, /courses/[slug]), SSG with params (blog, news, landing pages), and **dynamic server pages** (`/activities/[slug]` was `force-dynamic`) |
| Server code | Route handlers `/api/events`, `/api/courses`, `/api/gallery/[file]` (S3 proxy), `/api/brochure` (POST); `sitemap.xml` and `robots.txt` are generated |
| External APIs | logout.world company events API (`EVENTS_API_URL`, Bearer `EVENTS_API_KEY` / `COURSES_API_KEY`, server-only); public logout.world checkout catalog; logout.world checkout embed script (browser) |
| Other services | AWS S3 private bucket for the gallery (server-side keys), tawk.to chat (browser), Google Maps embed |
| Images | `next/image` with AVIF/WebP, remote pattern `logout.world/media/**`; source images in `public/images` are already WebP |
| Styling | One hand-written `app/globals.css` (188 KB raw, 35 KB gzip) plus Tailwind v4 (very few utility classes used) |
| State | zustand store `lib/stores/events.ts` (browser re-fetch of /api/events + /api/courses) |
| Deployment config | None for AWS. `.gitignore` has `.vercel/`; `@vercel/analytics` is rendered in the root layout |

**Conclusion:** this is **not a static React app**. It needs a running Node.js server for ISR, the image optimiser, route handlers holding API keys, and host-based redirects. `S3 + CloudFront static hosting` alone cannot run it.

## 2. Baseline measurements (before fixes)

| Check | Result |
|---|---|
| `next build` | Passed, 122 pages generated |
| `tsc --noEmit` | Passed |
| Lint | **Not possible.** No ESLint was installed or configured, and Next.js 16 removed `next lint` |
| `npm audit --omit=dev` | **28 vulnerabilities: 1 critical** (`fast-xml-parser` via `@aws-sdk/client-s3`), 23 moderate, 4 low |
| Route crawl (114 sitemap URLs + key pages) | All 200, one `<h1>` each, description, canonical, og:image present, no duplicate titles |
| `/activities/scuba-diving` TTFB | **5.3 s and 8.8 s** (two sequential requests) |
| `/api/events` / `/api/courses` | **5.7 s / 6.3 s** per request |
| Legacy URLs (`/booking`, `/about-us.html`, `/index.html` …) | **Not redirected**. The redirect table in `redirects.mjs` was never imported |

## 3. Issues found

| ID | Severity | Issue | File(s) |
|---|---|---|---|
| C1 | **Critical** | `redirects.mjs` (all old-site URL redirects, `/booking`, old subdomains) is never imported, so every old URL would 404 after the domain cut-over and lose its search ranking | `next.config.mjs`, `redirects.mjs` |
| H1 | High | Every request to an activity page, `/api/events` or `/api/courses` re-fetched all logout.world pages, with no server cache, causing 5–9 s TTFB. `React.cache` only dedupes within one request | `lib/api/events-server.ts`, `app/activities/[slug]/page.tsx`, `app/api/*` |
| H2 | High | 1 critical and 23 moderate production dependency vulnerabilities; `shadcn` (a CLI scaffolding tool) was a runtime dependency | `package.json` |
| H3 | High (AWS) | `<Analytics />` from `@vercel/analytics` renders in every production build. Off Vercel it requests `/_vercel/insights/script.js`, which 404s on every page | `app/layout.tsx` |
| M1 | Medium | No security headers (HSTS, nosniff, Referrer-Policy, frame options, Permissions-Policy); `X-Powered-By: Next.js` exposed | `next.config.mjs` |
| M2 | Medium | Preview deployments (`*.vercel.app`) are fully indexable | `next.config.mjs`, `app/robots.ts` |
| M3 | Medium | No lint tooling at all | — |
| M4 | Medium | Home and Activities fetch **all** events pages + courses again in the browser after the server already rendered them, which doubles upstream load | `components/home/stack.tsx`, `components/pages/experiences.tsx` |
| M5 | Medium | `axios` (~20 KB gzip) shipped to the browser only for two GET calls | `lib/api/client.ts`, `lib/stores/events.ts` |
| M6 | Medium | `console.log('Courses API:', …)` dumps the full courses payload in every visitor's console | `components/pages/courses.tsx` |
| M7 | Medium (AWS) | S3 client requires static access keys; on AWS an IAM role is the safer option | `app/api/gallery/[file]/route.ts` |
| M8 | Medium (AWS) | No container/standalone build, no health-check endpoint | — |
| L1 | Low | Several text links are under 24 px tall on mobile (card "Details", breadcrumbs, footer FAQ) | `app/globals.css` |
| L2 | Low | Dead code: `lib/api/client.ts` (after M5), `bookingUrl` (plain `http://`, unused), `poolNote`, unused import in `stack.tsx`; `lib/i18n.ts` and most of `lib/booking/cart.ts` are unused leftovers of the removed booking flow | various |
| L3 | Low | Custom select button uses `aria-activedescendant` without a role that supports it | `components/booking/picker.tsx` |
| L4 | Low | AWS SDK warns that releases after January 2027 require Node ≥ 22 | runtime |
| I1 | Info | On localhost the tawk.to script is blocked by CORS (`crossorigin` attribute, as in tawk's own snippet). Must be checked on the real domain (tawk domain allow-list) | `components/layout/tawk.tsx` |

## 4. Not issues (checked)

- API keys (`EVENTS_API_KEY`, `COURSES_API_KEY`, S3 keys) are **not** in the client bundle and **not** in any commit (searched all git history). `.env.local` is git-ignored.
- All `target="_blank"` links have `rel="noreferrer"`.
- JSON-LD is escaped (`<` → `<`); ratings are only emitted when real figures are configured.
- `/api/gallery` only serves listed file names, never arbitrary bucket keys.
