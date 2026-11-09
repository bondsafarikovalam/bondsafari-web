import { backend, verifyWebhookSignature } from '@/lib/booking/server'

// Razorpay → server notification, so a booking is still confirmed (or released) if the guest closes the tab
// before the browser reports back. Configure in the Razorpay dashboard for payment.captured, payment.failed
// and order.paid, pointing at /api/payments/razorpay-webhook.
export async function POST(req: Request) {
  const raw = await req.text()
  if (!verifyWebhookSignature(raw, req.headers.get('x-razorpay-signature'))) return new Response('invalid signature', { status: 400 })
  let event: { event?: string; payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; status: string } } } }
  try { event = JSON.parse(raw) } catch { return new Response('bad payload', { status: 400 }) }
  const p = event.payload?.payment?.entity
  if (!p) return Response.json({ ok: true })
  try {
    // The backend must treat this idempotently: the same payment may also arrive via /api/booking/verify
    await backend('payments/events', { method: 'POST', body: { event: event.event, paymentId: p.id, orderId: p.order_id, amount: p.amount, status: p.status, eventId: req.headers.get('x-razorpay-event-id') } })
    return Response.json({ ok: true })
  } catch {
    // A non-2xx makes Razorpay retry later
    return new Response('backend unavailable', { status: 502 })
  }
}
