import { addOns } from '@/data/site'
import { findProduct, type Product } from '@/data/products'

// Booking rules shared by the browser and the API routes. The server always re-runs these checks and
// re-prices from the catalogue; nothing the browser sends about money is trusted.

// Larger parties are routed to a group enquiry instead of the online flow
export const MAX_PARTY = 10
// How far ahead the online calendar opens
export const MAX_DAYS_AHEAD = 365

export type Customer = { name: string; phone: string; email: string; country?: string }
export type Slot = { id: string; time: string; capacity: number; remaining: number }
export type Batch = { id: string; startDate: string; endDate?: string; capacity: number; remaining: number }
export type DayStatus = { date: string; status: 'open' | 'closed' | 'full'; reason?: string }

export type CheckoutRequest = {
  kind: 'activity' | 'course'
  product: string
  date?: string
  slotId?: string
  batchId?: string
  adults: number
  children: number
  addOns: string[]
  customer: Customer
  declarations: string[]
  locale?: string
}

export type Confirmation = {
  reference: string
  product: string
  date?: string
  time?: string
  adults: number
  children: number
  amountPaid: number
  balanceDue: number
}

// Today's date in Kovalam, so a late-evening visitor abroad can't pick a day that has already passed in India
export const todayIST = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function validDate(value: string | null | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const d = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return undefined
  const today = todayIST()
  if (value < today || value > addDays(today, MAX_DAYS_AHEAD)) return undefined
  return value
}

const count = (v: string | null | undefined, min: number) => {
  if (v == null || !/^\d{1,2}$/.test(v)) return undefined
  const n = Number(v)
  return n >= min && n <= MAX_PARTY ? n : undefined
}

export type DeepLink = { product?: Product; date?: string; adults: number; children: number; issues: string[] }

// Reads /booking?activity=Scuba+Diving&date=2026-10-25&guests=2 (also accepts adults= and children=).
// Anything invalid is dropped with a visible note rather than failing the page.
export function parseDeepLink(q: Record<string, string | string[] | undefined>): DeepLink {
  const one = (k: string) => { const v = q[k]; return Array.isArray(v) ? v[0] : v }
  const issues: string[] = []
  const key = one('activity') ?? one('course') ?? one('product')
  const product = findProduct(key)
  if (key && !product) issues.push(`We couldn’t find “${key.slice(0, 60)}”. Please choose from the list.`)
  const rawDate = one('date')
  const date = validDate(rawDate)
  if (rawDate && !date) issues.push('That date isn’t available for online booking. Please pick another day.')
  const rawAdults = one('adults') ?? one('guests')
  let adults = count(rawAdults, 1)
  if (rawAdults && adults === undefined) issues.push(`Online booking is for 1–${MAX_PARTY} guests. For larger groups, message us on WhatsApp.`)
  const rawChildren = one('children')
  const children = count(rawChildren, 0) ?? 0
  if (adults === undefined) adults = 2
  if (adults + children > MAX_PARTY) return { product, date, adults: Math.min(adults, MAX_PARTY), children: 0, issues: [...issues, `Online booking is for up to ${MAX_PARTY} guests.`] }
  return { product, date, adults, children, issues }
}

// Builds the query string the flow keeps in the address bar, so refreshes and shared links restore the same state
export function bookingQuery(s: { product?: string; date?: string; adults?: number; children?: number }) {
  const q = new URLSearchParams()
  if (s.product) q.set('activity', s.product)
  if (s.date) q.set('date', s.date)
  if (s.adults) q.set('adults', String(s.adults))
  if (s.children) q.set('children', String(s.children))
  return q.toString()
}

export const addOnsFor = (slug: string) => addOns.filter(a => !a.for || a.for.includes(slug))

export type Quote = { perPerson: number; guests: number; base: number; extras: number; total: number; payNow: number; balance: number }

// Prices in rupees. Activities are paid in full; courses take the published booking amount now and the rest later.
export function quote(p: Product, adults: number, children: number, chosen: string[] = []): Quote | undefined {
  if (!p.amount) return undefined
  const guests = adults + children
  const base = p.amount * guests
  const extras = addOnsFor(p.slug).filter(a => chosen.includes(a.id)).reduce((sum, a) => sum + a.amount * (a.per === 'person' ? guests : 1), 0)
  const total = base + extras
  const payNow = p.kind === 'course' && p.deposit ? Math.min(p.deposit * guests, total) : total
  return { perPerson: p.amount, guests, base, extras, total, payNow, balance: total - payNow }
}

// Declarations the guest ticks before paying. Wording must be approved by the business before launch.
export function declarationsFor(p: Product) {
  const list = [{ id: 'terms', text: 'I have read the cancellation policy and agree to the booking terms.' }]
  if (p.minAge) list.push({ id: 'age', text: `Every guest in this booking is ${p.minAge} or older.` })
  if (p.medical) list.push({ id: 'medical', text: 'Every diver will complete the PADI medical questionnaire at the centre and tell the instructor about any medical condition before diving.' })
  if (p.kind === 'course') list.push({ id: 'prerequisites', text: `I meet the course requirements: ${p.prerequisite}.` })
  return list
}

const phoneOk = (s: string) => /^\+?[\d\s()-]{8,20}$/.test(s) && s.replace(/\D/g, '').length >= 8
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)

export function validateCustomer(c: Partial<Customer> | undefined) {
  const errors: Partial<Record<keyof Customer, string>> = {}
  if (!c?.name || c.name.trim().length < 2 || c.name.length > 80) errors.name = 'Please enter the lead guest’s full name.'
  if (!c?.phone || !phoneOk(c.phone)) errors.phone = 'Please enter a WhatsApp number with country code, e.g. +91 98765 43210.'
  if (!c?.email || !emailOk(c.email) || c.email.length > 120) errors.email = 'Please enter a valid email address.'
  return errors
}

// Full server-side check of a checkout request against the catalogue. Returns the product and the quote the
// server will charge, or a list of problems.
export function validateCheckout(body: unknown): { ok: true; req: CheckoutRequest; product: Product; quote: Quote } | { ok: false; errors: string[] } {
  const b = (body ?? {}) as Partial<CheckoutRequest>
  const errors: string[] = []
  const product = typeof b.product === 'string' ? findProduct(b.product) : undefined
  if (!product) return { ok: false, errors: ['Unknown product.'] }
  if (b.kind !== product.kind) errors.push('Product type mismatch.')
  const adults = Number(b.adults), children = Number(b.children ?? 0)
  if (!Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0 || adults + children > MAX_PARTY) errors.push(`Guests must be between 1 and ${MAX_PARTY}.`)
  if (product.kind === 'activity') {
    if (!validDate(b.date)) errors.push('Choose a valid date.')
    if (typeof b.slotId !== 'string' || !b.slotId || b.slotId.length > 64) errors.push('Choose a time slot.')
  } else if (typeof b.batchId !== 'string' || !b.batchId || b.batchId.length > 64) errors.push('Choose a batch.')
  const chosen = Array.isArray(b.addOns) ? b.addOns.filter((x): x is string => typeof x === 'string') : []
  const allowed = addOnsFor(product.slug).map(a => a.id)
  if (chosen.some(id => !allowed.includes(id))) errors.push('Unknown add-on.')
  const customerErrors = Object.values(validateCustomer(b.customer))
  errors.push(...customerErrors)
  const ticked = Array.isArray(b.declarations) ? b.declarations : []
  if (declarationsFor(product).some(d => !ticked.includes(d.id))) errors.push('Please accept all declarations.')
  const q = quote(product, adults, children, chosen)
  if (!q) errors.push('This product has no published price yet and can’t be paid online.')
  if (errors.length || !q) return { ok: false, errors }
  const c = b.customer!
  return { ok: true, product, quote: q, req: { kind: product.kind, product: product.slug, date: b.date, slotId: b.slotId, batchId: b.batchId, adults, children, addOns: chosen, declarations: ticked, locale: typeof b.locale === 'string' ? b.locale.slice(0, 5) : undefined, customer: { name: c.name.trim(), phone: c.phone.trim(), email: c.email.trim().toLowerCase(), country: typeof c.country === 'string' ? c.country.slice(0, 2) : undefined } } }
}
