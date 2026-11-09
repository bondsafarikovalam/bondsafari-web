import { validateCheckout } from '@/lib/booking/shared'
import { backend, bookingStatus, createOrder, errorResponse, razorpayKeyId } from '@/lib/booking/server'

// Step 1 of payment: re-validate everything, re-price from the catalogue, ask the backend to hold the seats
// (it re-checks availability atomically, so two guests can't take the last seat), then open a Razorpay order
// for exactly the held amount.
export async function POST(req: Request) {
  const status = bookingStatus()
  if (!status.backend || !status.payments) return Response.json({ code: 'not_configured', message: 'Online booking and payment are not connected yet.' }, { status: 503 })
  const checked = validateCheckout(await req.json().catch(() => null))
  if (!checked.ok) return Response.json({ code: 'invalid', message: checked.errors[0], errors: checked.errors }, { status: 400 })
  const { req: r, product, quote } = checked
  let holdId: string | undefined
  try {
    const hold = await backend<{ holdId: string; expiresAt: string }>('holds', { method: 'POST', body: { ...r, seller: product.seller, currency: 'INR', total: quote.total, payNow: quote.payNow, balance: quote.balance } })
    holdId = hold.holdId
    const order = await createOrder(quote.payNow, hold.holdId, product.slug)
    return Response.json({ holdId: hold.holdId, expiresAt: hold.expiresAt, orderId: order.id, amount: order.amount, currency: order.currency, keyId: razorpayKeyId(), seller: product.seller, quote })
  } catch (e) {
    // Don't leave seats blocked if the payment order couldn't be created
    if (holdId) await backend(`holds/${encodeURIComponent(holdId)}/release`, { method: 'POST' }).catch(() => {})
    return errorResponse(e)
  }
}
