import { findProduct } from '@/data/products'
import { validDate, type Slot } from '@/lib/booking/shared'
import { backend, errorResponse } from '@/lib/booking/server'

// Time slots and seats left for one activity on one day, straight from the booking backend (never cached)
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const product = findProduct(q.get('product'))
  const date = validDate(q.get('date'))
  if (!product || product.kind !== 'activity' || !date) return Response.json({ code: 'bad_request', message: 'Choose an activity and a valid date.' }, { status: 400 })
  try {
    const data = await backend<{ slots: Slot[]; closed?: boolean; reason?: string }>('availability', { query: { product: product.slug, date } })
    return Response.json({ date, slots: data.slots ?? [], closed: !!data.closed, reason: data.reason })
  } catch (e) { return errorResponse(e) }
}
