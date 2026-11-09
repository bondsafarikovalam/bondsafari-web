import { findProduct } from '@/data/products'
import { todayIST, type Batch } from '@/lib/booking/shared'
import { backend, errorResponse } from '@/lib/booking/server'

// Upcoming course batches with seats left
export async function GET(req: Request) {
  const product = findProduct(new URL(req.url).searchParams.get('course'))
  if (!product || product.kind !== 'course') return Response.json({ code: 'bad_request', message: 'Choose a course.' }, { status: 400 })
  try {
    const today = todayIST()
    const data = await backend<{ batches: Batch[] }>('batches', { query: { course: product.slug, from: today } })
    return Response.json({ batches: (data.batches ?? []).filter(b => b.startDate >= today) })
  } catch (e) { return errorResponse(e) }
}
