import { findProduct } from '@/data/products'
import { addDays, todayIST, validDate, type DayStatus } from '@/lib/booking/shared'
import { backend, errorResponse } from '@/lib/booking/server'

// Which days are open, full or closed (e.g. sea conditions) over the next six weeks, for greying out the calendar
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const product = findProduct(q.get('product'))
  const from = validDate(q.get('from')) ?? todayIST()
  if (!product || product.kind !== 'activity') return Response.json({ code: 'bad_request', message: 'Choose an activity.' }, { status: 400 })
  try {
    const data = await backend<{ days: DayStatus[] }>('availability/calendar', { query: { product: product.slug, from, to: addDays(from, 41) } })
    return Response.json({ days: data.days ?? [] })
  } catch (e) { return errorResponse(e) }
}
