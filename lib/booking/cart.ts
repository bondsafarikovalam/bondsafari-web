import { experiences } from '@/data/experiences'
import { courses } from '@/data/courses'
import { isBookable } from '@/data/programmes'

// Multi-activity booking rules: pricing, people limits, time clashes and the request message.
// Pure functions with no UI, so a booking server can re-run exactly the same checks later.

export type Option = {
  slug: string; title: string; kind: 'activity' | 'course'; image: string; imagePosition?: string
  duration: string; price?: string; minAge?: string; minPeople?: number; maxPeople?: number
  // The catalogue's name for a course the API renames, so older deep links still find it
  altTitle?: string
  // Its event on logout.world, known only once the live API has confirmed it; without one it can't be paid online
  eventSlug?: string
}
export type CartItem = { slug: string; people: number; time: string }
export type Cart = { date: string; group: number; items: CartItem[] }

const fallbackOptions: Option[] = [
  ...experiences.filter(e => isBookable(e.slug)).map(e => ({ slug: e.slug, title: e.title, kind: 'activity' as const, image: e.image, imagePosition: e.imagePosition, duration: e.duration, price: e.price, minPeople: e.minPeople, maxPeople: e.maxPeople })),
  // Only what's bookable online: professional programmes, Advanced Mermaid and paused activities go to WhatsApp instead
  ...courses.filter(c => isBookable(c.slug)).map(c => ({ slug: c.slug, title: c.title, kind: 'course' as const, image: c.image, imagePosition: c.imagePosition, duration: c.duration, price: c.price, minAge: c.minAge, minPeople: c.minPeople, maxPeople: c.maxPeople })),
]
export let options: Option[] = fallbackOptions
export const setActivityOptions = (activities: { slug: string; title: string; image: string; imagePosition?: string; duration: string; price?: string; minPeople?: number; maxPeople?: number; eventSlug?: string }[]) => {
  const activityOptions = activities.filter(e => isBookable(e.slug)).map(e => ({ ...e, kind: 'activity' as const }))
  options = [...activityOptions, ...options.filter(o => o.kind === 'course')]
}
// Only what's bookable here already, plus courses that exist solely in the API; held-back courses stay on WhatsApp
export const setCourseOptions = (live: { slug: string; title: string; image: string; duration: string; price?: string; eventSlug?: string }[]) => {
  const known = fallbackOptions.filter(o => o.kind === 'course')
  const updated = known.map(o => { const c = live.find(x => x.slug === o.slug); return c ? { ...o, title: c.title, altTitle: o.title, image: c.image, imagePosition: undefined, duration: c.duration, price: c.price ?? o.price, eventSlug: c.eventSlug } : o })
  const added = live.filter(c => isBookable(c.slug) && !known.some(o => o.slug === c.slug)).map(c => ({ slug: c.slug, title: c.title, kind: 'course' as const, image: c.image, duration: c.duration, price: c.price, eventSlug: c.eventSlug }))
  options = [...options.filter(o => o.kind === 'activity'), ...updated, ...added]
}
export const optionOf = (slug: string) => options.find(o => o.slug === slug)

// Online requests cover up to this many guests; larger groups are better arranged with the team directly
export const MAX_GROUP = 20
// Preferred times until real slots come from a booking engine (opening hours are 8:30 AM – 6:30 PM)
export type TimeOption = { id: string; hint?: string }
export const TIMES: TimeOption[] = [{ id: 'Morning', hint: '8:30 – 12' }, { id: 'Afternoon', hint: '12 – 4' }, { id: 'Evening', hint: '4 – 6:30' }]
// Activities with fixed departures or an earlier last slot than the general opening hours
const DIVE_TIMES = ['8:30 AM', '9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(id => ({ id }))
const ACTIVITY_TIMES: Record<string, TimeOption[]> = {
  'scuba-diving': DIVE_TIMES,
  'dive-safari': DIVE_TIMES,
  'freshwater-scuba': DIVE_TIMES,
  snorkeling: [{ id: 'Morning', hint: '9 – 12' }, { id: 'Afternoon', hint: '12 – 4' }, { id: 'Evening', hint: '4 – 5:30' }],
  parasailing: [{ id: 'Morning', hint: '9 – 12' }, { id: 'Afternoon', hint: '12 – 4' }, { id: 'Evening', hint: '4 – 5:30' }],
}
export const timesFor = (slug: string) => ACTIVITY_TIMES[slug] ?? TIMES
// Reads naturally after "both": "in the morning" for a window, "at 8:30 AM" for a fixed slot
export const timePhrase = (time: string) => TIMES.some(t => t.id === time) ? `in the ${time.toLowerCase()}` : `at ${time}`

export const unitPrice = (o?: Option) => Number(o?.price?.replace(/[^\d]/g, '') || 0)
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
export const priceLabel = (o: Option) => o.price ? o.price.replace(' per person', '') : 'Price on request'

// People allowed on one activity: never more than the group, and within the activity's own limits when set
export const peopleRange = (o: Option | undefined, group: number) => ({ min: Math.max(1, o?.minPeople ?? 1), max: Math.max(1, Math.min(group, o?.maxPeople ?? MAX_GROUP)) })

export function totals(cart: Cart) {
  const lines = cart.items.map(i => { const o = optionOf(i.slug); const unit = unitPrice(o); return { item: i, option: o, unit, subtotal: unit * i.people } })
  return {
    lines,
    total: lines.reduce((s, l) => s + l.subtotal, 0),
    // Activity places, not guests: one guest can take part in several activities
    places: cart.items.reduce((s, i) => s + i.people, 0),
    unpriced: lines.filter(l => !l.unit).map(l => l.option?.title ?? l.item.slug),
  }
}

// Activities in the same time window need different people: if they add up to more than the group, someone
// would have to be in two places at once
export function clashes(cart: Cart) {
  const byTime = new Map<string, CartItem[]>()
  for (const i of cart.items) if (i.time) byTime.set(i.time, [...(byTime.get(i.time) ?? []), i])
  return [...byTime].filter(([, list]) => list.length > 1 && list.reduce((s, i) => s + i.people, 0) > cart.group)
    .map(([time, list]) => ({ time, titles: list.map(i => optionOf(i.slug)?.title ?? i.slug) }))
}

// A cart holds several activities, or several courses: courses run on start dates rather than time slots, so the two aren't mixed
export function addItem(items: CartItem[], slug: string, group: number): CartItem[] {
  const o = optionOf(slug)
  if (!o || items.some(i => i.slug === slug)) return items
  const item = { slug, people: Math.min(group, peopleRange(o, group).max), time: '' }
  return [...items.filter(i => optionOf(i.slug)?.kind === o.kind), item]
}

export function problems(cart: Cart, step: number): string[] {
  const out: string[] = []
  if (step >= 1 && !cart.date) out.push('Please choose a date.')
  if (step >= 2 && !cart.items.length) out.push('Add at least one activity.')
  if (step >= 2) for (const i of cart.items) {
    const o = optionOf(i.slug); const r = peopleRange(o, cart.group)
    if (i.people < r.min || i.people > r.max) out.push(`${o?.title}: choose ${r.min === r.max ? r.min : `${r.min}–${r.max}`} ${r.max === 1 ? 'person' : 'people'}.`)
  }
  if (step >= 3) for (const c of clashes(cart)) out.push(`${c.titles.join(' and ')} are both ${timePhrase(c.time)}, but your group has ${cart.group} ${cart.group === 1 ? 'person' : 'people'}. Choose different times.`)
  return out
}

const longDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }
export { longDate }

export function requestMessage(cart: Cart, customer: { name: string; phone: string; email: string }) {
  const t = totals(cart)
  const course = t.lines.length > 0 && t.lines.every(l => l.option?.kind === 'course')
  return [
    `Hello Bond Safari! I’d like to book for ${course ? 'a start date of ' : ''}${longDate(cart.date)}:`,
    `Group: ${cart.group} ${cart.group === 1 ? 'person' : 'people'}`,
    ...t.lines.map((l, n) => `${n + 1}. ${l.option?.title} — ${l.item.people} ${l.item.people === 1 ? 'person' : 'people'}${l.item.time ? ` · ${l.item.time}` : course ? '' : ' · any time'} · ${l.unit ? inr(l.subtotal) : 'price on request'}`),
    t.total ? `Total: ${inr(t.total)}${t.unpriced.length ? ' + items priced on request' : ''}` : '',
    `Name: ${customer.name.trim()}`,
    `WhatsApp: ${customer.phone.trim()}`,
    customer.email.trim() ? `Email: ${customer.email.trim()}` : '',
  ].filter(Boolean).join('\n')
}
