# Launch checklist — open decisions and missing business information

Everything below needs an answer from Bond Safari before production. Nothing here has been invented on the site:
missing values are left out of the page (or shown as "Price on request") until supplied in the files named.

## 1. Booking engine and payments (blocks launch)

- [ ] **Choose the booking backend.** Build the Express service to the contract in `docs/booking-api.md`, or put an
      adapter in front of a platform (Bókun, FareHarbor, Rezdy, or the current logout.world). It must support
      per-slot capacity for the boats, batches with seat limits, holds, and GST invoices.
- [ ] **Razorpay merchant account(s).** Which legal entity is the merchant for each product? Today the catalogue
      says *Bond Safari Kovalam* (activities) and *Bond Academy* (courses), as listed on logout.world. The IDC page
      there names *Bond Water Sports Pvt Ltd*. Checkout shows the seller, so this must be right.
- [ ] Set the env vars in `.env.example` on the host, then run an end-to-end test with `rzp_test_` keys: success,
      failure, closing the payment window, and webhook-only confirmation (close the tab before redirect).
- [ ] Configure the Razorpay webhook → `/api/payments/razorpay-webhook` (`payment.captured`, `payment.failed`,
      `order.paid`).
- [ ] Decide on "pay 20% now, rest at the centre" for activities. Today activities are paid in full; courses take
      the published booking amount.
- [ ] Add rate limiting or bot protection (e.g. Cloudflare Turnstile) to `/api/booking/*` on the host.

## 2. Prices and GST (`data/experiences.ts`, `data/courses.ts`)

Prices were copied from the live booking catalogue on 2026-10-21. **GST is contradictory there:** most product
pages say "+18% GST" in the price breakdown but "taxes included" in the description. On the site, "incl. GST" is
shown only where the business's own product copy says taxes are included (`gst: 'included'`).

- [ ] Confirm the GST treatment for every product. No "incl. GST" is shown yet for: Discover Scuba in Freshwater,
      Scuba in the Rain, Snorkel & Kayak Cove, Monsoon Combo, Coracle Rides, Kayaking, SUP, Advanced Open Water,
      Rescue Diver, Freediver.
- [ ] **Publish from-prices** for: Bond Safari (underwater scooter, the flagship), Sea Life Safari, Introduction to Scuba Diving,
      Swimming (kids/adult, six levels). Until then they can't be paid online, only requested.
- [ ] Child pricing. Today every guest pays the per-person price.
- [ ] Booking amounts (`deposit`) came from logout.world: OW, AOW, Mermaid and Advanced Mermaid ₹10,000; EFR,
      Rescue, Divemaster, Zero to Hero and Mermaid Diva ₹5,000; Freediver ₹15,000; IDC ₹50,000. Confirm them, and
      when the balance is due.
- [ ] Add-ons (photo/video pack, optical mask, hotel pickup, combo discount): add them to `addOns` in
      `data/site.ts`, with prices. The add-ons step appears automatically once the list isn't empty.

## 3. Eligibility and safety

- [ ] **Bond Safari minimum age / weight limits.** The live site says "no age limit". Confirm this is operationally
      true for an underwater scooter, and supply any weight or medical limits.
- [ ] Minimum age for PADI Discover Scuba Diving (sea), Sea Life Safari and Introduction to Scuba Diving. None is published.
- [ ] Approve the wording of the booking declarations (`declarationsFor` in `lib/booking/shared.ts`) and the
      diving medical note on detail pages (`components/detail.tsx`).
- [ ] Weather and sea-condition rescheduling policy → `business.weatherPolicy` in `data/site.ts`.
- [ ] Safety facts (instructor ratios, oxygen and first aid on the boat, rescue boat cover, insurance) →
      `business.safety`.
- [ ] Kerala Tourism / KATPS operator registration as it should appear publicly → `business.registration`.
- [ ] Meeting-point arrival time ("arrive 30 minutes before") → `meetingPoint.arrival`.
- [ ] IDC duration: the site says 15 days, but the logout.world itinerary covers 8 days. Which is right?

## 4. Claims that must be provable (already on the site; kept, but verify)

- [ ] "PADI 5★ IDC" / "5 Star Instructor Development Center" (courses page, trust strip). Is it held by the entity
      named, and used within PADI's trademark rules?
- [ ] "Kerala Govt. training partner (ASAP)", "ASAP skill loan up to ₹1,50,000"
- [ ] "100% placement assistance" (Zero to Hero)
- [ ] "No swimming ability needed" (PADI Discover Scuba Diving)
- [ ] "In partnership with Cool Divers SL, Spain" (footer, team section)
- [ ] PADI Platinum Course Director Mark J Soworka (IDC)

## 5. Catalogue gaps (not published until details exist)

Listed in `pendingProducts` (`data/products.ts`):

- Second / repeat dive, Fun dives, PADI ReActivate ("Already tried diving?" path). Today it links Open Water,
  Introduction to Scuba Diving and Advanced Open Water.
- **Surfing** (beginner lesson, 3-day course, board rental). Not on the live site at all. The activity group is
  named "Paddle" until these exist.
- SUP: is the live ₹2,500 product a lesson or a rental?
- Dive + Snorkel Day, Family Pack
- PADI Deep, Nitrox, Peak Performance Buoyancy, Underwater Photographer
- Swimming course levels, prices and schedule

## 6. Photos (`imagePending: true` in the catalogue)

These borrow another product's photo until real ones are supplied: Snorkel & Kayak Cove, Scuba in the Rain, Stand-up
Paddleboarding, Divemaster, Freediver, PADI Mermaid, Mermaid Diva.

## 7. Trust, people and reviews (`business` in `data/site.ts`)

- [ ] Google Business Profile rating, count and URL → `business.google`. The trust strip, reviews section and
      LocalBusiness rating markup appear only once this is filled in from the live profile.
- [ ] TripAdvisor → `business.tripadvisor`
- [ ] Named instructors with PADI numbers and photos → `business.instructors`. Course advisor → `business.courseAdvisor`.
- [ ] Founder story for About and home (the audit mentions "fisherman's son, 25 years at sea"). Supply approved copy.
- [ ] The five testimonials on the home page come from the old homepage and have no date or source. Replace them
      with dated Google or TripAdvisor reviews when available.
- [ ] Confirm the WhatsApp number (`contact.whatsapp`, currently +91 84484 48846). Social links (`socials` in
      `data/site.ts`) were updated to Instagram `bond_safari_kovalam`, Facebook, YouTube `@bondsafarikovalam` and
      LinkedIn; X/Twitter was removed.

## 8. Languages

The booking-flow strings live in `lib/i18n.ts`. Malayalam and Hindi dictionaries are empty on purpose: they need a
fluent reviewer, not machine translation. A language is offered (`readyLocales`) only when its dictionary is
complete. Malayalam and Devanagari font fallbacks are already loaded on demand. Server error messages
(`lib/booking/shared.ts`) are English-only for now.

## 9. Not built (needs a requirements decision first)

Gift vouchers, corporate and group pages, guest accounts and Bond Membership pricing, multi-company redemption,
and a staff-editable CMS. Today prices live in two TypeScript files. Moving the catalogue into the booking
platform or a CMS is the long-term fix for price drift. The `Product` shape in `data/catalogue.ts` is the contract
to keep.

## Activities & courses by category (`/programmes`)

Content for Freediving, Mermaid and Advanced Sports comes from the Bond Water Sports Academy decks (PADI Freediver
Career Playbook, PADI Mermaid Pathways, PADI Technical Diving Career Pathways, Oct 2026). All of it lives in
`data/programmes.ts`. Earnings figures and internal business notes from the decks are deliberately not published.

- [ ] **PADI verification (blocking):** Freediver Instructor first-aid prerequisite — EFR within 24 months vs active
      EFR Instructor. Flagged on the page until PADI Asia Pacific confirms in writing.
- [ ] PADI verification: mermaid instructor tier names and routes; "Assistant Instructor" freediving rating; every
      TecRec standard (read from PADI public pages, not the instructor manual).
- [ ] Master Freediver constant-weight target (27 m vs 32 m).
- [ ] **Pool with lane exclusivity** — gates every freediving and mermaid course above Discover. Those show
      "Coming soon / Register interest" until it is signed.
- [ ] Child-safety policy (screening, ratios, supervision, photo consent) before any mermaid booking.
- [ ] Prices and durations for every new programme (all show "Ask us"): Discover Freediving, Skin Diver, freediving
      levels, mermaid levels, Divemaster (stand-alone), Enriched Air, Deep Diver, Gas Blender, Tec levels.
- [ ] Which new programmes Bond actually runs today. Marked "Enquire": Discover Freediving, Skin Diver, Divemaster,
      Enriched Air, Deep Diver. Everything else is "Coming soon", "Via partner centres" or "Earned by teaching".
- [ ] Tec phase 2 gates: written chamber + evacuation plan, oxygen-clean blending, Tec Deep Instructor, insurer
      confirmation. Phase 3 (Trimix, CCR, Cave) is shown as referred to partner centres.
- [ ] Photos: no freediving, mermaid-level or technical diving images exist; those pages reuse underwater/scuba photos.
- [ ] Canoeing and stand-up paddleboarding are listed under Parasports as "Enquire" with no price, duration or location.
      Logout.world has a stand-up paddleboarding product; confirm whether it is a lesson or a rental and its price.
- [ ] PADI Mermaid sits under Parasports, not Freediving (client instruction). What can be booked online is decided in
      one place, `heldBack` / `statusOf` in `data/programmes.ts`: Zero to Hero, IDC and Divemaster are "Apply", Advanced
      Mermaid is "Enquire" until the pool agreement and child-safety policy are in place, and the Bond Safari scooter is
      "Paused". Remove an entry there to open online booking again.
- [x] Muziris website URLs: the "Explore our Muziris locations" section (home page and Parasports) links each card's
      Explore More button to its page on bondpaddlesports.com (`website` in `data/locations.ts`), which handles details
      and booking.
- [ ] Kottapuram's meeting point is not confirmed and is not shown.
- [ ] Course and activity locations still show Kovalam / Freshwater quarry / Lakshadweep as the source data says.
- [ ] Freshwater quarry location (Discover Scuba in Freshwater, Monsoon Combo, Kayaking) — name the site.
