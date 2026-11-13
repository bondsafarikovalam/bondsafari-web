# Bond Safari – SEO Report

Checked on the production build of `chore/aws-production-readiness` (114 URLs: every sitemap URL plus `/`, `/faq`, `/activities`, `/courses`).

## Verified in place

| Requirement | Status | How it is implemented / checked |
|---|---|---|
| Unique titles | ✅ | `pageMeta()` per page; crawl found **no duplicate titles** across 114 URLs |
| Meta descriptions | ✅ | Present on all 114; cut at ~160 chars by `snippet()` |
| Canonical URLs | ✅ | Every page's canonical equals its own path (crawl), absolute on `NEXT_PUBLIC_SITE_URL` |
| Open Graph / Twitter cards | ✅ | `og:image` on all 114; `summary_large_image`; locale `en_IN` |
| robots.txt | ✅ | Allows all, disallows `/api/`, points to the sitemap. With `SITE_NOINDEX=true` it disallows everything |
| sitemap.xml | ✅ | 114 URLs incl. API-only activities/courses, blog/news with images; revalidates hourly; no duplicates |
| Heading hierarchy | ✅ | Exactly one `<h1>` on every crawled page; FAQ uses H1 → H2 (category) → H3 (question) |
| Image alt | ✅ | No `<img>` without `alt` on any page. Decorative images use `alt=""` next to a visible title |
| Structured data | ✅ | `LocalBusiness` + `SportsActivityLocation` (address, phone, hours, socials), `Product`/`Course` with INR offers, `BreadcrumbList`, `ItemList` (Activities), `FAQPage` (/faq, course FAQs), articles |
| Breadcrumbs | ✅ | Visible breadcrumb + `BreadcrumbList` on detail pages and FAQ |
| Local SEO | ✅ (partly) | Kovalam, Kerala in titles/descriptions; full NAP in JSON-LD and footer; Google Maps embed |
| Indexability | ✅ | No `noindex` on production pages, except unpublished API activities (intended) |
| Old-URL equity | ✅ **fixed (C1)** | 308 redirects from the old WordPress URLs are now active |
| Preview duplicates | ✅ **fixed (M2)** | `*.vercel.app` sends `X-Robots-Tag: noindex` |

## Target keywords – where they rank in on-page signals

| Keyword | Primary page(s) |
|---|---|
| Scuba Diving in Kovalam | `/` (title), `/activities/scuba-diving`, `/scuba-diving-in-kerala`, `/scuba-diving-kovalam-price`, blog `/blog/scuba-diving-in-kovalam` |
| Water Sports in Kovalam | `/` and `/activities` titles ("Water Sports & Activities in Kovalam") |
| PADI Diving Courses in Kerala | `/courses`, `/padi-open-water-kerala`, each `/courses/*` (Course schema) |
| Snorkeling in Kovalam | `/activities/snorkeling`, `/faq#snorkelling` |
| Adventure Activities in Kerala | `/activities`, `/things-to-do-in-kovalam` |

No keyword stuffing was added; copy was not rewritten.

## Not done on purpose (needs real business data – nothing was invented)

| Item | Why open | Where to fill |
|---|---|---|
| Google rating / review count in schema | No verified figures | `business.google` in `data/site.ts` |
| Kerala Tourism / KATPS registration | Not supplied | `business.registration` |
| Geo coordinates in `LocalBusiness` | Not supplied; guessing would hurt | `lib/seo.tsx` `localBusinessLd()` |
| Privacy policy / terms page | Does not exist | new route, then footer link |
| FAQ rich results | `FAQPage` markup is valid, but Google now shows FAQ rich results mainly for government/health sites | — |

## Launch-day SEO tasks (outside the code)

1. Point `www.bondsafarikovalam.com` to the AWS stack and redirect the bare domain to `www` at CloudFront/DNS (the app does not do this, see `redirects.mjs`).
2. Submit `https://www.bondsafarikovalam.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools; use the Change of Address tool only if the domain changes (it doesn't).
3. Update the Google Business Profile website link and any QR codes (`docs/url-migration.md`).
4. Re-crawl the top old URLs after the cut-over and confirm each returns 308 → 200.
