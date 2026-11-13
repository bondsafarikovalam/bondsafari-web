# Bond Safari – Performance Report

## Method

Lab measurements on this machine, against the standalone production server on localhost. They are **not** field data and
not a Lighthouse score. Field Core Web Vitals must be confirmed after launch (Search Console → Core Web Vitals, or CrUX).

- Headless Chrome, 390×844 @2x mobile, **CPU throttled 4×**, network **150 ms RTT / 1.6 Mbps down / 750 kbps up**, cache disabled.
- LCP / CLS from `PerformanceObserver`; TBT = sum of long-task time over 50 ms; bytes = encoded transfer size.
- Run-to-run variance in this setup is about ±0.5–1 s for LCP (e.g. /faq measured 1.35 s and 2.58 s).

## Server response time (TTFB)

| Route | Before | After |
|---|---|---|
| `/activities/scuba-diving` | 5.3 s / 8.8 s | 4–10 ms |
| `/activities/<API-only>` first view | 8–11 s (measured during the parallel crawl) | 2.0 s (then 6 ms) |
| `/api/events` | 5.7 s | 5 ms |
| `/api/courses` | 6.3 s | 8 ms |
| `/`, `/activities`, `/courses` | 4–6 ms (ISR) | 4–6 ms |

Cause and fix: see H1 in the fixes report (server cache + ISR for activity pages).

## Core Web Vitals (lab, mobile, final build)

| Route | LCP | CLS | TBT | JS | Images | Total |
|---|---|---|---|---|---|---|
| `/` | 3.5 s ❌ | 0.000 ✅ | 598 ms | 290 KB | 99 KB | 1,357 KB (incl. hero video) |
| `/activities` | 2.55 s ⚠️ | 0.000 ✅ | 44 ms | 290 KB | 63 KB | 457 KB |
| `/courses` | 2.64 s ⚠️ | 0.000 ✅ | 2 ms | 269 KB | 101 KB | 466 KB |
| `/activities/scuba-diving` | 1.53 s ✅ | 0.000 ✅ | 51 ms | 283 KB | 24 KB | 408 KB |
| `/faq` | 1.35–2.58 s ✅ | 0.000 ✅ | 0 ms | 250 KB | 25 KB | 373 KB |

- **CLS 0.000 on every page.** Images have dimensions or fill boxes; fonts use `next/font` (self-hosted, preloaded).
- **INP** cannot be measured in a lab run. TBT is low (≤ 51 ms) everywhere except home (≈600 ms), which is the INP risk.
- JS dropped by ~20 KB per page after removing axios from the browser (before: 271–310 KB).

## Already good (verified)

- Hero image of each page is preloaded (`priority` / `preload` with `fetchPriority: high`); home hero poster is WebP with a `srcSet`.
- Below-the-fold images are lazy (`next/image` default); AVIF/WebP served by the optimiser; e.g. a 326 KB gallery JPEG → 17 KB.
- Remote API images restricted to `logout.world/media/**` and resized per screen.
- Static assets: `/_next/static` immutable; `/images`, `/videos` cached 1 week; API JSON cacheable 5 min at the CDN.
- The page-loader is a dynamic import; framer-motion uses `LazyMotion` (`m.` components).

## Remaining (needs a design decision – not changed)

| Item | Effect | Suggested fix |
|---|---|---|
| Home: LCP 3.5 s, TBT ~600 ms | Fails the 2.5 s target on slow mobile | Defer the hero video further (only on fast connections / after LCP), and trim home-page client components (many framer-motion sections hydrate at once) |
| Activities/Courses: LCP ~2.6 s, element is the hero paragraph | Just over target | The hero text fades/rises in; starting it visible (transform-only animation) or removing the delay brings LCP to about first paint |
| One global stylesheet, 188 KB (35 KB gzip), render-blocking on every page | Adds to first paint on slow networks | Split page-specific CSS into CSS Modules / route-level files |
| CDN | Today every request reaches the server | CloudFront in front (see the AWS guide) cuts TTFB for visitors outside Mumbai |
