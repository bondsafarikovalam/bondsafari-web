# Bond Safari – Business Facts & Booking Verification

Branch `chore/aws-production-readiness`, 2026-11-13. This is an audit only: no claim, price, age, duration or FAQ answer was
changed.

**Sources compared**
- **Website:** the live production build. Every sitemap page was crawled for visible text, and the source files were read.
- **logout.world events API:** Bond Safari's own listing, 52 events, 22 of them published (`EVENTS_API_KEY`). `COURSES_API_KEY` returns **0 events**.
- **logout.world checkout catalog:** the saved widget that every Book button opens, with 12 events.

> **"Verified" in this report means the website matches Bond Safari's own logout.world data.** That data is written by Bond Safari.
> No claim was checked with PADI, ASAP Kerala or any other third party; those confirmations are listed as decisions below.

---

## 1. Claims

| # | Claim | On the website (page → section) | In logout.world data | Status |
|---|---|---|---|---|
| 1 | **PADI 5 Star IDC** | `/` trust strip "PADI 5★ Instructor Development Center"; `/about` title "PADI 5 Star Dive Centre" + stat "5★ PADI IDC Dive Resort"; `/courses` hero "Bond Academy · PADI 5 Star IDC", stat strip, "Train & get certified" step ("PADI 5★★★★★ Master Instructor…"); `/courses/open-water-diver` overview "PADI 5★ instructors"; `/courses/zero-to-hero` overview; `/scuba-diving-in-kerala` | Zero to Hero highlights "PADI 5 Star Instructor Development Center"; IDC highlights "PADI 5 Star IDC Resort"; mermaid courses "5Star IDC Resort" | **Consistent, not independently confirmed.** Two wordings are used: "Dive Centre" (/about title) and "IDC / IDC Resort" (everywhere else) |
| 2 | **ASAP** (Kerala Govt. training partner; skill loan up to ₹1,50,000) | `/courses` stat "ASAP · Kerala Govt. training partner"; `/courses/zero-to-hero` overview; `/courses/instructor-development` overview + inclusions "ASAP skill loan up to ₹1,50,000"; `/about` meta description | Zero to Hero: "ASAP, Kerala Govt. Training Partner"; IDC: "ASAP skill loan facilities … up to ₹1,50,000" | **Consistent, not independently confirmed** |
| 3 | **Placement assistance** | `/courses/zero-to-hero` "100% placement assistance" (overview + inclusions); `/courses` Zero to Hero feature "100% placement assistance"; `/padi-open-water-kerala` "placement assistance" | Zero to Hero: "100% placement assistance program" (highlights) and "Job Placement Assistance: Support for career opportunities" (inclusions); IDC: "job placement assistance" | **Consistent, not confirmed.** logout.world itself uses both "100%" and plain "assistance" |
| 4 | PADI Platinum Course Director Mark J Soworka | `/courses/instructor-development`; `/about` (network section) | IDC highlights | Consistent, not confirmed |

## 2. Minimum ages

The website shows each course's minimum age from the site's own data. The API's `minimum_age` is shown in the activity "At a glance" box.

| Page | Website | logout.world | Status |
|---|---|---|---|
| All 10 published activities (`/activities/*`) | 10 years | 10 | ✅ |
| `/courses/open-water-diver`, `/courses/emergency-first-response` | 10 years | 10 | ✅ |
| `/courses/advanced-open-water`, `/courses/rescue-diver`, `/courses/advanced-mermaid` | 12 years | 12 | ✅ |
| `/courses/zero-to-hero`, `/courses/instructor-development` | 18 years | 18 | ✅ |
| `/courses/basic-mermaid` | 6 | 6 | ✅ |
| `/courses/mermaid` | 10 | 10 | ✅ |
| **`/courses/freediver`** → "At a glance" + "Course requirements" | **15** | **12** (API text: "Participants must be at least 12 years old") | ❌ **Conflict.** Source: `data/programmes.ts:62` |
| `/courses/divemaster` | not shown | 18 | ⚠️ Missing on the website |
| **Parasailing** → `/faq` (Parasailing Q4) | **8 years** (`data/faq.ts:35`) | No parasailing activity is published. Both published parasailing combos say **10**; an unpublished "3-in-1" package says 8 | ❌ **Conflict.** Needs the owner's answer |
| Discover Scuba Diving → `/faq` (Scuba Q5) | 10 years (`data/faq.ts:228`) | 10 | ✅ |

## 3. Durations

| Item | Website | logout.world | Status |
|---|---|---|---|
| **IDC** | 15 days (`/courses/instructor-development`, `/courses`, `/`) | `number_of_days` 15 | ✅ Consistent. The itinerary that previously listed 8 days is now **empty** in logout.world, so the earlier "8 vs 15" question can't be checked against it |
| **PADI Discover Scuba Diving** | **4 hours** on `/activities`, `/activities/scuba-diving`, `/faq` comparison table (`data/faq.ts:200`) | `number_of_hours` 4; description "In just 4 hours and ₹6500" | ✅ where the API is used |
| ↳ same, older value still shown | **"2.5 – 3 hours · ₹4,500"** on: `/` → "Here's your next step" → "Dive again" card; `/scuba-diving-kovalam-price`, `/scuba-diving-in-kerala`, `/things-to-do-in-kovalam` → price table and tiles (+ "from ₹4,500" in the intro); `/courses/rescue-diver` and `/courses/open-water-diver` → related "PADI Discover Scuba Diving" card | 4 hours, **₹6,500** | ❌ **Conflict (duration and price).** Source: `data/experiences.ts:4` (static catalogue), used by `components/home/next-step.tsx:17`, `data/landing.ts` / `components/pages/landing.tsx`, course related cards |
| Introduction to Scuba Diving | 2.5 hours (`/faq` table, activity page) | 2.5 hours, ₹5,000 | ✅ |
| Basic Mermaid | Course page shows API "2 days"; site copy says "1 pool session (about 2 hours)" | 2 days | ⚠️ Wording conflict in the site copy |
| Mermaid | API "3 days"; site copy "2 pool sessions (about 6 hours)" | 3 days | ⚠️ Same |
| Freediver | API "4 days"; site copy "About 15 hours over 2–3 days" | 4 days (`number_of_hours` 48) | ⚠️ Same |
| All other courses (OW, AOW, EFR, Rescue, Zero to Hero, Advanced Mermaid) | | | ✅ Price and duration match |

## 4. Book Now buttons vs the logout.world checkout

Every Book button opens the same saved checkout widget (`bond-safari` / `62e5a81c-…`). The widget lists only these 12 events:
9 activities and 3 courses.

**Courses** (the website's button follows the API: Book now unless the checkout marks the course not bookable)

| Course | Website button | In the checkout widget? | Result for the guest |
|---|---|---|---|
| PADI Rescue Diver | Book now | ✅ bookable | OK |
| Zero to Hero | Book now | ✅ bookable | OK |
| IDC | Enquire (WhatsApp) | listed, **bookable: false** | OK (enquiry) |
| Open Water Diver, Advanced Open Water, EFR, Divemaster, Basic Mermaid, Mermaid, Advanced Mermaid, Mermaid Diva, Freediver | **Book now** | ❌ **not in the widget** | ❌ The checkout opens, but the course the guest clicked is not in it |

**Activities**

| Activity | Website button | Checkout | Result |
|---|---|---|---|
| DSD, Intro to Scuba, Kayaking, Snorkelling, Game Fishing, Coracle, both parasailing combos | Book now | ✅ bookable | OK |
| **Standup Paddleboarding** | Book now | listed, **bookable: false** | ❌ Button promises booking; the checkout won't take it |
| **Surfing** | Book now | ❌ not in the widget | ❌ Same problem as the courses above |

## 5. Configuration

| Item | Status |
|---|---|
| Tawk.to property ID | Configured |
| **Tawk.to widget ID** | **Not configured (empty in `.env.local`)**, so the chat does not load. The value is not shown here |
| `COURSES_API_KEY` | Valid key, but the account returns **0 events**; every course comes from the Bond Safari events list |

---

## 6. Decisions required from the business owner

| # | Decision | Options |
|---|---|---|
| D1 | **PADI 5 Star IDC:** confirm the current rating and which entity holds it (Bond Safari Kovalam or Bond Academy), plus the PADI store number. Pick one wording: "PADI 5 Star IDC" or "5 Star IDC Dive Resort"; `/about` currently also says "Dive Centre" | Confirm + wording |
| D2 | **ASAP Kerala:** confirm the training-partner status is current and the skill-loan limit is still **₹1,50,000** | Confirm / correct / remove |
| D3 | **Placement:** "100% placement assistance" or "placement assistance"? A "100%" promise is a stronger claim | Choose wording |
| D4 | **Parasailing minimum age:** **8** (FAQ) or **10** (logout.world combos)? The weight and harness condition in the FAQ stays either way | 8 / 10 |
| D5 | **Freediver minimum age:** **12** (logout.world) or **15** (website)? (PADI Freediver normally allows 15, or 12 as Junior Freediver; please confirm which you offer) | 12 / 15 |
| D6 | **PADI Discover Scuba Diving:** confirm **₹6,500 / 4 hours** (logout.world) is correct. If yes, approve replacing the old ₹4,500 / 2.5–3 hours on the home "next step" card, the 3 landing pages and the related cards. The best fix is for those spots to read the API like the activity pages do | Approve |
| D7 | **Mermaid / Freediver schedule wording:** do the site's descriptions ("1 pool session", "2 pool sessions", "15 hours over 2–3 days") or logout.world's 2 / 3 / 4 days describe the real schedule? | Pick the source to keep |
| D8 | **Checkout widget:** add OW, AOW, EFR, Divemaster, the 4 mermaid courses, Freediver and Surfing to the logout.world widget, and make SUP bookable. Otherwise approve showing **Enquire** on those buttons until they are added | Add in dashboard / switch to Enquire |
| D9 | **Divemaster:** publish a minimum age (logout.world says 18) on the website? | Yes / no |
| D10 | **Tawk chat:** set the widget ID, or confirm the chat should stay off | Configure / keep off |
| D11 | **COURSES_API_KEY:** is the academy account meant to be empty (all courses under Bond Safari), or should courses move there? | Confirm |

Nothing above has been changed. After each decision, the matching edit is small and is listed with its source file in the
tables above.
