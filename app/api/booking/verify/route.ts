import type { Confirmation } from '@/lib/booking/shared'
import { backend, errorResponse, fetchOrder, fetchPayment, verifyPaymentSignature } from '@/lib/booking/server'

// Step 2 of payment: the browser reports success, but the booking is only confirmed after the server has
// verified Razorpay's signature, fetched the payment itself, and the backend has re-checked the hold.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({})) as { orderId?: string; paymentId?: string; signature?: string }
  if (!b.orderId || !b.paymentId || !b.signature || !verifyPaymentSignature(b.orderId, b.paymentId, b.signature)) return Response.json({ status: 'failed', code: 'bad_signature', message: 'We couldn’t verify this payment. If money left your account, contact us with your payment ID.' }, { status: 400 })
  try {
    const [order, payment] = await Promise.all([fetchOrder(b.orderId), fetchPayment(b.paymentId)])
    const holdId = order.notes?.holdId
    if (!holdId || payment.order_id !== order.id || payment.amount !== order.amount) return Response.json({ status: 'failed', code: 'mismatch', message: 'This payment doesn’t match the booking. Please contact us with your payment ID.' }, { status: 400 })
    if (payment.status === 'failed') return Response.json({ status: 'failed', code: 'payment_failed', message: 'The payment failed. You have not been charged.' })
    // Authorised but not yet captured: the webhook confirms it once Razorpay captures the payment
    if (payment.status !== 'captured') return Response.json({ status: 'pending', paymentId: payment.id, message: 'Your payment is being processed. We’ll confirm on WhatsApp and email as soon as it clears.' })
    const { booking } = await backend<{ booking: Confirmation }>(`holds/${encodeURIComponent(holdId)}/confirm`, { method: 'POST', body: { orderId: order.id, paymentId: payment.id, amount: payment.amount, method: payment.method } })
    return Response.json({ status: 'confirmed', booking })
  } catch (e) { return errorResponse(e) }
}
