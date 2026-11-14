# Legal pages: management confirmation checklist

**For:** Bond Safari Managing Director and the reviewing legal professional
**Pages:** [/privacy-policy](/privacy-policy) · [/terms-and-conditions](/terms-and-conditions) · [/cancellation-policy](/cancellation-policy) · [/refund-policy](/refund-policy)
**Source:** "Bond Safari – Website Legal Pages Information & Policy Guidelines" (PDF)
**Content file:** `data/legal.ts`

These four pages are drafts for business review. They are not certified legal advice. The source PDF says the final legal content must be reviewed and approved by Bond Safari's Managing Director and a qualified legal professional before publication.

## How the drafts are held back until approval

- Each page shows a "Draft for review" banner.
- Each page carries `noindex`, so search engines don't list it.
- The pages are left out of `sitemap.xml`.
- Each open point appears on the page as a highlighted **[MANAGEMENT CONFIRMATION REQUIRED]** tag.

The footer already links to the pages, so visitors can reach them as soon as the site is deployed.

**To publish after approval:**

1. Resolve every item below in `data/legal.ts` and remove each `${FLAG}` sentence.
2. Set `LAST_UPDATED` to the approval date.
3. Set `LEGAL_APPROVED = true`. This removes the banner, makes the pages indexable and adds them to the sitemap.

---

## A. Business identity (all four pages)

| # | Question | Where it appears |
|---|---|---|
| A1 | **Which company operates the website and contracts with customers?** The PDF names two: Bond Water Sports Pvt. Ltd. (GSTIN 32AAICB4429P1ZE) and Bond Adventures Pvt. Ltd. (GSTIN 32AAHCB9453C1ZW). If both, which activities does each one provide? | Privacy §1, Terms §1, the business box on every page |
| A2 | "Last updated" now shows 14 November 2026, the date the drafts were written. Change it to the approval date when publishing. | Every page header |
| A3 | Two emails are given. enquiry@bondsafarikovalam.com is the official email; sales@bondsafarikovalam.com handles privacy complaints and also appears in the PDF signature. Confirm that this split is intended. | Contact sections, Privacy §10 |

## B. Privacy Policy

| # | Question |
|---|---|
| B1 | **Website analytics and cookies.** The site uses Vercel Analytics and can send booking-funnel events to a Google Tag Manager dataLayer if one is installed. Confirm which analytics or tracking tools are in use and whether cookies are set, so §2 can describe them accurately. The PDF doesn't cover this. |
| B2 | **Promotional consent.** How do customers opt in to promotional updates, and how do they opt out (unsubscribe link, email request, WhatsApp)? |
| B3 | **Customer rights.** Which rights apply under Indian data protection law (e.g. the Digital Personal Data Protection Act, 2023), how requests are made and the response time. *Legal professional to confirm.* |
| B4 | **Grievance officer.** Whether a named grievance officer, a postal address for complaints or a response timeline must be published. *Legal professional to confirm.* |
| B5 | *(Optional)* Specific retention periods. The PDF says only "according to applicable legal and business requirements", and the draft uses that wording. |
| B6 | *(Optional)* Confirm the sentence "Access to customer information, including medical and fitness information, is restricted to authorised personnel." The PDF says access "should be" restricted; the page states it as current practice. |

## C. Terms & Conditions

| # | Question |
|---|---|
| C1 | **Refund when participation is denied for safety reasons** (e.g. medically unfit, intoxicated, not following instructions). Is any refund given? |
| C2 | **Insurance.** Does any insurance apply to participants or activities, and on what terms? The draft advertises no insurance, as the PDF requires. |
| C3 | **Limitation of liability, governing law and jurisdiction.** Not in the PDF. *Legal professional to draft or approve.* |
| C4 | *(Optional)* Minimum ages for PADI courses beyond Discover Scuba Diving, and for snorkelling and surfing. The draft keeps the PDF wording: "subject to activity-specific … requirements". |

## D. Cancellation Policy

| # | Question |
|---|---|
| D1 | **How days are counted.** Calendar days? What cut-off time and time zone? Is the activity date included? Example: cancelling at 9 PM the evening before; is that "1–9 days" or "same day"? |
| D2 | **Official cancellation channels.** Email and phone are listed. Are WhatsApp and the online booking platform also accepted? Which timestamp decides the cancellation period? |
| D3 | **Late arrival.** If a late arrival leads to cancellation, is it a no-show (100%)? Does reduced activity time change the amount payable? |
| D4 | **Rescheduling inside a cancellation window.** Is rescheduling within 60 days treated as a cancellation? What are the rescheduling charges? The draft says only that they will be communicated before confirmation. |
| D5 | **Training programmes cancelled before training starts.** Does the standard table apply? |

## E. Refund Policy

| # | Question |
|---|---|
| E1 | **Advance payments.** If only an advance was paid and the cancellation charge is higher than the advance, does the customer owe the difference, or is the charge capped at the amount paid? |
| E2 | **Refund amount when Bond Safari cancels.** Does "applicable refund" or "refund of the applicable booking amount" mean a full refund of the amount paid? |
| E3 | **Wording "or other reasons within its control".** It comes from the PDF and is kept verbatim. Weather and sea conditions are outside Bond Safari's control, so confirm whether this should read "within or outside its control". |
| E4 | **Refund timeline start.** Do the 5–7 business days run from approval of the request? Should the page say bank credit times may vary? |
| E5 | **Payment gateway or third-party charges.** Which charges are non-refundable and how much are they? The PDF says they will be disclosed before booking "where relevant". |
| E6 | The illustration table on the Refund Policy uses a sample ₹10,000 booking to explain charge versus balance. Approve or remove it. |

## F. Consistency with the booking system (important)

| # | Question |
|---|---|
| F1 | **Per-activity policies on logout.world.** Online bookings go through the logout.world checkout. Each activity there carries its own "Terms & conditions" and "Cancellation policy" text, shown on the activity pages and in the booking flow. These must match the new site-wide policies, or the activity text must defer to them. Otherwise customers will see two different policies. |
| F2 | The booking flow asks customers to confirm "I have read the cancellation policy and agree to the booking terms." Once approved, this should link to /cancellation-policy and /terms-and-conditions. |
| F3 | Package and combo bookings, such as Kayaking + Parasailing, and group bookings aren't addressed in the PDF. Do the same cancellation and refund rules apply? |

---

## Cross-check against the PDF (done)

- Cancellation charges are unchanged: more than 60 days 0%, 30–60 days 50%, 10–29 days 75%, 1–9 days 90%, same day 100%. No-shows are 100%.
- Ages are unchanged: Discover Scuba Diving minimum 10 years; parasailing minimum 8 years, subject to equipment fit and operational requirements; kayaking depends on age, suitability and equipment.
- The 12-hour interval between scuba diving and flying is unchanged, with the PDF's qualifier.
- The refund timeline of 5 to 7 business days, preferably to the original payment method, is unchanged.
- Training programmes are non-refundable once training has commenced, including the initial briefing and in-water training. This appears in both the Cancellation and Refund policies.
- The weather and emergency provisions are given in full in Terms §8. The Cancellation and Refund policies refer to them with consistent wording.
- Contact details match the PDF: enquiry@bondsafarikovalam.com, +91 84484 48846, and the address at Suseela Tower, VRP XIX/553-A, Beach Road, Kovalam 695527. "Kerala" was added to the address.
- No security technologies, retention periods, insurance cover, governing law or liability limits have been added that are not in the PDF.
