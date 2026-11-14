import { findProduct } from '@/data/products'
import { validateCustomer } from '@/lib/booking/shared'
import { BackendError, backend } from '@/lib/booking/server'
import { clientKey, isSameOrigin, rateLimit } from '@/lib/request-guard'

// Up to 10 brochure requests per visitor in 10 minutes: plenty for a guest, too few to flood the enquiry list
const LIMIT = 10
const WINDOW_MS = 10 * 60 * 1000

// A brochure request: the name and number go to the backend as an enquiry for the team to follow up.
// A failure to store it never stands between the guest and the brochure, so it answers saved: false instead
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ code: 'forbidden', message: 'Please request the brochure from the Bond Safari website.' }, { status: 403 })
  const retryAfter = rateLimit(`brochure:${clientKey(req)}`, LIMIT, WINDOW_MS)
  if (retryAfter) return Response.json({ code: 'rate_limited', message: 'Too many brochure requests. Please try again in a few minutes.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } })
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
