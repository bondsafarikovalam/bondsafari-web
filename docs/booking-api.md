# Booking backend contract

The website never decides availability itself. The Next.js route handlers in `app/api/booking/*` validate and
re-price every request from the catalogue (`data/experiences.ts`, `data/courses.ts`), then call a booking backend
(the separate Node/Express service, or an adapter in front of a platform such as Bókun, FareHarbor, Rezdy or
logout.world) at `BOOKING_API_URL`.

Every request carries `Authorization: Bearer ${BOOKING_API_KEY}` and JSON bodies. Errors should be JSON
`{ "code": "...", "message": "guest-readable text" }` with a meaningful status; the message is shown to the guest.

| Method & path | Purpose | Response |
|---|---|---|
| `GET /availability?product=<slug>&date=YYYY-MM-DD` | Slots for one activity on one day | `{ slots: [{ id, time: "09:00", capacity, remaining }], closed?: boolean, reason?: string }` |
| `GET /availability/calendar?product=<slug>&from=&to=` | Day status for the date strip (sea-condition closures, sold-out days) | `{ days: [{ date, status: "open" \| "closed" \| "full", reason? }] }` |
| `GET /batches?course=<slug>&from=YYYY-MM-DD` | Upcoming course batches | `{ batches: [{ id, startDate, endDate?, capacity, remaining }] }` |
| `POST /holds` | Reserve seats while the guest pays | `201 { holdId, expiresAt }` or `409 { code: "sold_out", message }` |
| `POST /holds/:holdId/release` | Guest closed the payment window, or the payment order failed | `200 { ok: true }` |
| `POST /holds/:holdId/confirm` | Payment verified by the website server | `200 { booking: { reference, product, date?, time?, adults, children, amountPaid, balanceDue } }` |
| `POST /payments/events` | Razorpay webhook events, forwarded after signature check | `200` |
| `POST /enquiries` | Requests for unpriced products, preferred course dates, groups | `201 { reference }` |

## What the backend must guarantee

- **No double booking.** `POST /holds` must check and decrement `remaining` atomically (a DB transaction or row
  lock per slot/batch) and return `409` when there aren't enough seats. Holds should expire (10–15 minutes) and
  return their seats automatically.
- **Confirm re-checks the hold.** `confirm` must fail if the hold has expired or was released. If money was taken
  for an expired hold, flag it for refund rather than overbooking.
- **Idempotency.** The same payment can arrive from both `/api/booking/verify` (browser) and the webhook.
  Use `paymentId` (and the `x-razorpay-event-id` passed as `eventId`) to process each payment once.
- **Amounts.** `POST /holds` receives `total`, `payNow` and `balance` in rupees, computed by the website server
  from the catalogue. Razorpay amounts (`amount` on confirm and events) are in **paise**.
- **Confirmation messages.** Sending the WhatsApp/email confirmation (booking ID, meeting point, what to bring,
  arrival time) is the backend's job after `confirm` or a `payment.captured` event.
- **Data minimisation.** The website never sends card or UPI details (Razorpay Checkout handles them). Store only
  what is needed to run the booking: name, phone, email, party size, declarations ticked.

## `POST /holds` body

```json
{
  "kind": "activity",
  "product": "scuba-diving",
  "date": "2026-10-25",
  "slotId": "s1",
  "batchId": null,
  "adults": 2,
  "children": 1,
  "addOns": [],
  "declarations": ["terms", "age", "medical"],
  "customer": { "name": "…", "phone": "+91…", "email": "…" },
  "seller": "Bond Safari Kovalam",
  "currency": "INR",
  "total": 13500,
  "payNow": 13500,
  "balance": 0
}
```

Courses send `batchId` instead of `date`/`slotId`, and `payNow` is the published booking amount × participants.

## Payment flow (Razorpay: UPI, cards, netbanking)

1. Browser → `POST /api/booking/checkout`. The server validates, prices, creates the hold, then creates a Razorpay
   order for `payNow` with `notes.holdId`. If order creation fails, the hold is released.
2. Browser opens Razorpay Checkout with the order id. Only `RAZORPAY_KEY_ID` reaches the browser.
3. On success → `POST /api/booking/verify`. The server checks the HMAC signature, **fetches the order and payment
   from Razorpay itself**, matches amounts, reads `holdId` from the order notes (not from the browser), and only
   then calls `confirm`. `authorized`-but-not-captured payments return `pending`; the webhook finishes them.
4. Razorpay → `POST /api/payments/razorpay-webhook` (configure `payment.captured`, `payment.failed`,
   `order.paid`). The signature is verified against the raw body before forwarding.

Tested locally on 2026-10-21 against a mock backend: proxying, validation, sold-out (409), hold release on order
failure, forged checkout signatures and tampered webhook bodies all behave as above. **Not yet tested with real
Razorpay test keys or a real backend.**
