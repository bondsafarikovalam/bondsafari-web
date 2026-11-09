# URL migration — old bondsafarikovalam.com → new site

Implemented in `redirects.mjs` as permanent (308) redirects, and verified locally with `next start` on
2026-10-21. Old URLs were taken from the live site's navigation, programs page and news listing.

| Old URL | New URL | Notes |
|---|---|---|
| `/index.html` | `/` | |
| `/about-us.html` | `/about` | |
| `/scuba-diving-in-kerala/` | `/scuba-diving-in-kerala` | **Kept as a real page** (search landing page). It's the URL that ranks for "Scuba Diving in Kerala". |
| `/programs.html` | `/activities` | |
| `/sea-life-safari.html` | `/activities/sea-life-safari` | |
| `/dive-safari.html` | `/activities/dive-safari` | |
| `/swimming-course.html` | `/courses/swimming-course` | |
| `/dive-course.html` | `/courses` | |
| `/gallery.html` | `/gallery` | |
| `/news.html`, `/news.html/:page` | `/news` | |
| `/2017/:month/*.html` (press articles) | `/news` | 20+ press URLs (underwater wedding, CEO conference, plastic clean-up). |
| `/cgblog/:id/*.html` (press and blog posts) | `/news` | |
| Root-level press pages (`/A-pledge-taken-underwater-…html` and 4 others) | `/news` | Listed individually in `redirects.mjs`. |
| `/shop.html` | **not redirected (404)** | No shop on the new site. Decide: 410 Gone, or a destination. |
| `bookings.bondsafarikovalam.com/blogs` | `/news` | Works only once the subdomain's DNS points at this app. |
| `bookings.bondsafarikovalam.com/*` | `/booking` | Same DNS condition. |
| `courses.bondsafarikovalam.com/*` | `/courses` | Same DNS condition. |
| `/experiences`, `/experiences/:slug` | `/activities`, `/activities/:slug` | From the earlier rename. |

**Recommended next step for press:** the old articles have backlinks. If their text or clippings can be
exported, give each one a page at `/news/<slug>` and point its redirect there instead of the shared `/news` page.

## Links to replace outside the website on cut-over day

These point to the old booking system and won't be fixed by redirects:

- Instagram bio and story highlights (`bit.ly/bondsafari-kovalam-*`, `logout.world/tours/*`)
- Google Business Profile: website, "Book" and product links
- Printed QR codes, flyers and boat/centre signage
- WhatsApp Business catalogue and auto-replies
- TripAdvisor and OTA listings

**Don't retire the `logout.world` booking pages until online booking here is live.** Until then the booking page
offers them as a fallback ("Or book on our current booking page"), through each product's `legacyBookingUrl`
in the catalogue. Remove those URLs once the new engine is connected.

## Host canonicalisation

Bare domain ↔ `www` is left to the Hostinger/DNS configuration. Pick one (the site's canonical URLs assume
`https://www.bondsafarikovalam.com`; change `NEXT_PUBLIC_SITE_URL` if not) and 301 the other at the host.
