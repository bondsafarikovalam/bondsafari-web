# Bond Safari – Fixes Implemented

Branch `chore/aws-production-readiness`. Nothing is committed or deployed. The design, branding, booking widget
(logout.world checkout) and API contracts are unchanged.

Verification was run against the **standalone production server** (`.next/standalone/server.js`, which is the same artifact the
container runs) on `127.0.0.1:3100`, built from this branch.

| ID | Severity | Fix | Files | Verification |
|---|---|---|---|---|
| C1 | Critical | `legacyRedirects` imported into `next.config.mjs`. The duplicate `/experiences` rules in the config were dropped; the `/programmes` rules are kept | `next.config.mjs` | `/booking`, `/about-us.html`, `/index.html`, `/experiences`, `/experiences/kayaking`, `/contact-us.html`, `/dive-course.html`, `/news.html/2`, `/2017/05/x`, `/programmes`, `/programmes/freediving` → **308** to the right page |
| H1 | High | In-memory cache for logout.world responses (5 min TTL). Simultaneous requests share one call; a stale copy is served immediately while it refreshes, and is kept if logout.world fails. Covers list pages, the checkout catalog and single events. `/activities/[slug]` moved from `force-dynamic` to ISR (`revalidate = 300`) | `lib/api/events-server.ts`, `app/activities/[slug]/page.tsx` | `/activities/scuba-diving` 5.3–8.8 s → **4–10 ms**; `/api/events` 5.7 s → **5 ms**; `/api/courses` 6.3 s → **8 ms**; API-only activity first view **2.0 s**, then 6 ms |
| H1b | High | `/api/events` and `/api/courses` send `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600` so CloudFront can cache them | `app/api/events/route.ts`, `app/api/courses/route.ts` | Header present (curl) |
| H2 | High | `npm audit fix` (no major upgrades); removed the `shadcn` CLI from dependencies (`components.json` is kept; run it with `npx shadcn` when needed) | `package.json`, `package-lock.json` | `npm audit --omit=dev`: **0 vulnerabilities**. next 16.4.3, react 19.3.1, axios 1.21.0 unchanged |
| H3 | High | Vercel Analytics only renders when `VERCEL=1` (set automatically by Vercel), so previews keep it and AWS doesn't request a missing script | `app/layout.tsx` | Build passes; component gated |
| M1 | Medium | Security headers on every response: HSTS (2 years), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`; `poweredByHeader: false` | `next.config.mjs` | All present, `X-Powered-By` absent (curl) |
| M2 | Medium | `X-Robots-Tag: noindex, nofollow` for any `*.vercel.app` host; `SITE_NOINDEX=true` adds the header everywhere and makes `robots.txt` disallow all, for an AWS staging stack | `next.config.mjs`, `app/robots.ts` | `Host: bondsafari-web-625u.vercel.app` → noindex; `Host: www.bondsafarikovalam.com` → no header |
| M3 | Medium | ESLint 9 + `eslint-config-next@16.4.3` (core-web-vitals + typescript), `npm run lint` and `npm run typecheck` scripts | `eslint.config.mjs`, `package.json` | `npm run lint`: **0 errors, 0 warnings** (was 4 errors, 8 warnings) |
| M3a | Medium | Lint errors `react-hooks/set-state-in-effect` fixed without changing behaviour: prop/path resets now happen during render (picker, page loader); browser-only values via `useSyncExternalStore` (home clock, hero video) | `components/booking/picker.tsx`, `components/layout/page-loader.tsx`, `components/home/stack.tsx`, `components/home/site.tsx` | Lint clean; pages render, 0 JS exceptions in browser test |
| M4 | Medium | The browser only re-fetches activities when the server-rendered list is empty (server/API failed) | `components/home/stack.tsx`, `components/pages/experiences.tsx` | No duplicate /api/events calls on normal loads |
| M5 | Medium | Browser store uses `fetch` with a 15 s timeout instead of axios; `lib/api/client.ts` deleted. Axios stays on the server | `lib/stores/events.ts` | JS per page **−20 KB** compressed (e.g. /activities 310 → 290 KB) |
| M6 | Medium | Removed the production `console.log` of the courses payload | `components/pages/courses.tsx` | grep: no `console.log` left in app code |
| M7 | Medium | S3 client uses the static keys only when both are set, otherwise the AWS default credential chain (App Runner/ECS role) | `app/api/gallery/[file]/route.ts` | Gallery image via `/api/gallery/2-scaled.jpg` → 200 image/jpeg; optimised 326 KB → 17 KB |
| M8 | Medium | `output: 'standalone'`, `Dockerfile` (Node 22 Alpine, multi-stage, non-root, `HEALTHCHECK`), `.dockerignore`, `GET /api/health` (no upstream calls) | `next.config.mjs`, `Dockerfile`, `.dockerignore`, `app/api/health/route.ts` | Standalone server runs, `/api/health` → `{"ok":true}`. **Docker image build NOT executed** (Docker Desktop daemon was not running) |
| L1 | Low | Larger invisible tap area (≈44 px) on card "Details" links, breadcrumbs and footer links. The design is unchanged | `app/globals.css` | CSS added. The automated check measures element boxes, so it still lists them; please verify by touch on a phone |
| L2 | Low | Removed `lib/api/client.ts`, unused `bookingUrl` (`http://`), unused `poolNote`, unused import | various | Lint clean |
| L3 | Low | Select button given `role="combobox"` | `components/booking/picker.tsx` | Lint a11y warning gone |
| L4 | Low | `engines.node >= 20.9.0`; Docker image uses Node 22 | `package.json`, `Dockerfile` | — |

## Tests actually executed

| Test | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass, 0 problems |
| `next build` (final) | Pass, exit 0 |
| Crawl of 114 routes (sitemap + key pages) | All 200; 1 `<h1>`; description, canonical (self), og:image present; no duplicate titles |
| Browser test, 11 pages × 8 widths (320, 360, 375, 390, 414, 768, 1024, 1440) | **No horizontal overflow, no broken images, no JS exceptions** in all 88 combinations. The only console error is the tawk.to CORS block on localhost (I1) |
| API outage (events API pointed at a dead port) | All pages 200 from cache; `/api/events` → 502 JSON message (no crash); `/api/courses` → `[]`, so the Courses page shows the static catalogue |
| Secrets scan | API/S3 keys absent from `.next/static` and from all git history |

No Playwright suite exists in the repo; the browser tests above were run with headless Chrome over the DevTools protocol.
Those scripts are not part of the repo.

## Deliberately not changed

- The design and animations: the hero entrance animations affect LCP (see the performance report) and need a design decision.
- Content facts: open items are in `docs/launch-checklist.md`. Two FAQ/site mismatches are still open: parasailing minimum age (8 vs 10) and DSD duration (4 h vs 2.5–3 h).
- `lib/booking/server.ts`/`shared.ts`: still used by `/api/brochure`, which stores leads only if `BOOKING_API_URL` is set (it is not; leads answer `saved:false`).
- No Content-Security-Policy yet (see the AWS guide).
