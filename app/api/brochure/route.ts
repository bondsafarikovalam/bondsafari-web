import { findProduct } from '@/data/products'
import { validateCustomer } from '@/lib/booking/shared'
import { BackendError, backend } from '@/lib/booking/server'

// A brochure request: the name and number go to the backend as an enquiry for the team to follow up.
// A failure to store it never stands between the guest and the brochure, so it answers saved: false instead
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({})) as { product?: unknown; name?: unknown; phone?: unknown }
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  const phone = typeof b.phone === 'string' ? b.phone.trim() : ''
  const errors = validateCustomer({ name, phone })
  const message = errors.name ?? errors.phone
  if (message) return Response.json({ code: 'invalid', message }, { status: 400 })
  const title = typeof b.product === 'string' ? b.product.slice(0, 120) : ''
  const product = findProduct(title)
  try {
    await backend('enquiries', { method: 'POST', body: { product: product?.slug ?? title, seller: product?.seller, guests: 1, customer: { name, phone }, message: `Brochure download: ${title}` } })
    return Response.json({ saved: true })
  } catch (e) {
    console.error('Brochure lead not stored:', e instanceof BackendError ? e.code : e)
    return Response.json({ saved: false })
  }
}
