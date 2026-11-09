import { createHmac, timingSafeEqual } from 'node:crypto'

// Server-only: imported by app/api/* route handlers and server components. Reads secrets that must never reach
// the browser (none of these variables carry the NEXT_PUBLIC_ prefix, so Next.js never inlines them client-side).
//
//   BOOKING_API_URL          Base URL of the booking backend (Node/Express) that owns availability and bookings
//   BOOKING_API_KEY          Shared secret sent to that backend as a Bearer token
//   RAZORPAY_KEY_ID          Razorpay key id (also handed to Checkout in the browser — it is public by design)
//   RAZORPAY_KEY_SECRET      Razorpay key secret — server only
//   RAZORPAY_WEBHOOK_SECRET  Secret configured on the Razorpay webhook — server only
//
// The backend contract these calls expect is documented in docs/booking-api.md.

const env = (k: string) => process.env[k]?.trim() || undefined

export const bookingStatus = () => ({
  backend: !!(env('BOOKING_API_URL') && env('BOOKING_API_KEY')),
  payments: !!(env('RAZORPAY_KEY_ID') && env('RAZORPAY_KEY_SECRET')),
})

export class BackendError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message) }
}

// Calls the booking backend. Times out rather than leaving a guest staring at a spinner.
export async function backend<T>(path: string, init: { method?: string; body?: unknown; query?: Record<string, string> } = {}): Promise<T> {
  const base = env('BOOKING_API_URL'), key = env('BOOKING_API_KEY')
  if (!base || !key) throw new BackendError(503, 'not_configured', 'Online booking is not connected yet.')
  const url = new URL(path.replace(/^\//, ''), base.endsWith('/') ? base : `${base}/`)
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v)
  let res: Response
  try {
    res = await fetch(url, { method: init.method ?? 'GET', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', accept: 'application/json' }, body: init.body === undefined ? undefined : JSON.stringify(init.body), cache: 'no-store', signal: AbortSignal.timeout(10_000) })
  } catch {
    throw new BackendError(502, 'backend_unreachable', 'The booking system is not responding. Please try again in a moment.')
  }
  const data = await res.json().catch(() => ({})) as T & { code?: string; message?: string }
  if (!res.ok) throw new BackendError(res.status, data.code ?? 'backend_error', data.message ?? 'The booking system returned an error.')
  return data
}

// ---- Razorpay (UPI, cards, netbanking) ------------------------------------------------------------------

const rzpAuth = () => `Basic ${Buffer.from(`${env('RAZORPAY_KEY_ID')}:${env('RAZORPAY_KEY_SECRET')}`).toString('base64')}`

async function razorpay<T>(path: string, body?: unknown): Promise<T> {
  if (!bookingStatus().payments) throw new BackendError(503, 'payments_not_configured', 'Online payment is not connected yet.')
  let res: Response
  try {
    res = await fetch(`https://api.razorpay.com/v1/${path}`, { method: body ? 'POST' : 'GET', headers: { authorization: rzpAuth(), 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store', signal: AbortSignal.timeout(10_000) })
  } catch {
    throw new BackendError(502, 'payments_unreachable', 'The payment provider is not responding. You have not been charged.')
  }
  const data = await res.json().catch(() => ({})) as T & { error?: { description?: string } }
  if (!res.ok) throw new BackendError(502, 'payments_error', data.error?.description ?? 'The payment provider returned an error.')
  return data
}

export type RzpOrder = { id: string; amount: number; currency: string; status: string; notes?: Record<string, string> }
export type RzpPayment = { id: string; order_id: string; amount: number; currency: string; status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'; method?: string }

// Amounts are in paise. The hold id travels in the order notes so the server, not the browser, links payment to booking.
export const createOrder = (rupees: number, holdId: string, product: string) =>
  razorpay<RzpOrder>('orders', { amount: Math.round(rupees * 100), currency: 'INR', receipt: holdId.slice(0, 40), notes: { holdId, product } })
export const fetchOrder = (id: string) => razorpay<RzpOrder>(`orders/${encodeURIComponent(id)}`)
export const fetchPayment = (id: string) => razorpay<RzpPayment>(`payments/${encodeURIComponent(id)}`)
export const razorpayKeyId = () => env('RAZORPAY_KEY_ID')

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

// Checkout success signature: HMAC-SHA256(order_id|payment_id, key_secret)
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = env('RAZORPAY_KEY_SECRET')
  if (!secret) return false
  return safeEqual(createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex'), signature)
}

// Webhook signature: HMAC-SHA256(raw body, webhook secret)
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = env('RAZORPAY_WEBHOOK_SECRET')
  if (!secret || !signature) return false
  return safeEqual(createHmac('sha256', secret).update(rawBody).digest('hex'), signature)
}

// Shapes a thrown error into the JSON the booking flow understands
export function errorResponse(e: unknown) {
  if (e instanceof BackendError) return Response.json({ code: e.code, message: e.message }, { status: e.status })
  console.error('[booking]', e)
  return Response.json({ code: 'server_error', message: 'Something went wrong on our side. You have not been charged.' }, { status: 500 })
}
