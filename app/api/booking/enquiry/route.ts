import { findProduct } from '@/data/products'
import { MAX_PARTY, validDate, validateCustomer, type Customer } from '@/lib/booking/shared'
import { backend, errorResponse } from '@/lib/booking/server'

// Course batch requests, group requests and unpriced products: stored by the backend for the team to follow up.
// This is a request, not a booking — the flow says so.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({})) as { product?: string; date?: string; batchId?: string; guests?: number; customer?: Customer; message?: string }
  const product = findProduct(b.product)
  const guests = Number(b.guests ?? 1)
  const errors = Object.values(validateCustomer(b.customer))
  if (!product) errors.unshift('Choose an activity or course.')
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_PARTY * 5) errors.push('Enter the number of guests.')
  if (errors.length || !product) return Response.json({ code: 'invalid', message: errors[0], errors }, { status: 400 })
  const c = b.customer!
  try {
    const data = await backend<{ reference: string }>('enquiries', { method: 'POST', body: { product: product.slug, seller: product.seller, date: validDate(b.date), batchId: typeof b.batchId === 'string' ? b.batchId.slice(0, 64) : undefined, guests, customer: { name: c.name.trim(), phone: c.phone.trim(), email: c.email.trim().toLowerCase() }, message: typeof b.message === 'string' ? b.message.slice(0, 1000) : undefined } })
    return Response.json({ reference: data.reference })
  } catch (e) { return errorResponse(e) }
}
