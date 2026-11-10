import { experiences, type Experience } from '@/data/experiences'

export type EventRecord = {
  id: number
  slug: string
  name: string
  sub_heading?: string | null
  duration?: string | number | null
  number_of_hours?: string | number | null
  number_of_days?: string | number | null
  who_for?: string | null
  category_id?: number | null
  publish?: boolean
  soldout?: boolean
  cover_pic?: string | null
  list_pic?: string | null
  event_location?: string | null
  meetingpoint?: string | null
  highlights?: string | null
  difficulty_level?: string[] | null
  link_howToReach?: string | null
  inclusions?: string | null
  exclusions?: string | null
  carry?: string | null
  other_info?: string | null
  termsncondition?: string | null
  cancelation_policy?: string | null
  About_Tour?: string | null
  Trip_Highlights?: string | null
  price?: number | string | null
  price_striked?: number | string | null
  minimum_age?: number | null
  maximum_age?: number | null
  group_size?: string | number | null
  price_includes_gst?: boolean
  state?: string | null
  host_event_url?: string | null
  prices?: { id: number; attribute?: string | null; price?: number | null; inventory?: number | null; active?: boolean; soldout?: boolean }[]
}

export type EventsResponse = { count: number; page: number; page_size: number; total_pages: number; results: EventRecord[] }

const entities: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…' }
const decode = (value: string) => value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code: string) => code[0] !== '#' ? entities[code.toLowerCase()] ?? match : String.fromCodePoint(Number(code[1].toLowerCase() === 'x' ? `0${code.slice(1)}` : code.slice(1))))
const stripHtml = (value?: string | null) => decode(value?.replace(/<[^>]+>/g, ' ') ?? '').replace(/\s+/g, ' ').trim()
// The CMS sends rich text: one entry per paragraph, list item or line break
const blocks = (html?: string | null) => (html ?? '').split(/<\/(?:p|li|div|h[1-6])>|<br\s*\/?>/i).map(stripHtml).filter(Boolean)

// Many names are typed in capitals; acronyms stay as they are and short joining words go lower case
const acronyms = ['PADI', 'DSD', 'OWD', 'IDC']
const joiners = ['a', 'an', 'and', 'at', 'for', 'in', 'of', 'on', 'the', 'to', 'with']
const tidyCaps = (value: string) => value !== value.toUpperCase() ? value : value.replace(/[A-Za-z]+/g, (word, index: number) => {
  if (acronyms.includes(word)) return word
  const lower = word.toLowerCase()
  return index > 0 && joiners.includes(lower) ? lower : lower[0].toUpperCase() + lower.slice(1)
})

// "Turtle Time: Spot sea turtles" becomes a titled highlight; a line without a title continues the one before it, and "Your adventure awaits:" only introduces the list
const highlightsOf = (html?: string | null) => blocks(html).reduce<NonNullable<Experience['highlights']>>((list, line) => {
  if (line.endsWith(':')) return list
  const [, title, text] = line.match(/^([^:]{2,32}?)\s*:\s+(.+)$/) ?? []
  const last = list[list.length - 1]
  if (title) list.push({ title, text })
  else if (last?.title) last.text += ` ${line}`
  else list.push({ text: line })
  return list
}, [])

const countOf = (value: string | number | null | undefined, unit: string) => Number(value) ? `${Number(value)} ${unit}${Number(value) === 1 ? '' : 's'}` : undefined
const firstSentence = (value: string) => value.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? value
const section = (title: string, html?: string | null) => ({ title, items: blocks(html) })
const mediaUrl = (path?: string | null) => {
  if (!path) return undefined
  if (/^https?:\/\//i.test(path)) return path
  const base = process.env.NEXT_PUBLIC_EVENTS_MEDIA_BASE_URL || 'https://logout.world/media'
  return base ? `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}` : undefined
}

// Catalogue activities whose event has a different slug in the API
const eventSlugs: Record<string, string> = {
  'scuba-diving': 'padi-discover-scuba-dive',
  'dive-safari': 'introduction-to-scuba-diving',
  'stand-up-paddleboarding': 'standup-paddleboarding',
  snorkeling: 'snorkelling',
  'freshwater-scuba': 'discover-scuba-diving',
  'monsoon-combo': 'monsoon-freshwater-combo-pack-dive-glide-with-bond-safari-kovalam',
}
const coverOf = (event?: EventRecord) => mediaUrl(event?.cover_pic || event?.list_pic)
// The API's photo for a catalogue activity, when it has one
export const apiSlugOf = (slug: string) => eventSlugs[slug] ?? slug
// logout.world's brochure for an event: a ready PDF, downloaded as an attachment
export const brochureOf = (eventSlug: string) => `https://logout.world/tours/${encodeURIComponent(eventSlug)}/pdf/?download=1`
export const coverIn = (events: EventRecord[], slug: string) => coverOf(events.find(event => event.slug === apiSlugOf(slug)))

export function eventToExperience(event: EventRecord, fallback?: Experience): Experience {
  const about = blocks(event.About_Tour)
  const description = stripHtml(event.sub_heading) || about.join(' ') || fallback?.description || 'A guided Bond Safari adventure in Kovalam.'
  // A short opening line such as "Dive Deeper, Discover More!" is the tagline, so the overview starts after it
  const opener = about.length > 1 && about[0].length <= 80 ? about[0] : undefined
  const amount = Number(event.price || event.prices?.find(price => price.active !== false)?.price || 0)
  return {
    ...(fallback ?? {}),
    slug: event.slug,
    title: tidyCaps(event.name).replace(/\(\s+/g, '(').replace(/\s+\)/g, ')'),
    category: fallback?.category ?? 'Adventure',
    description,
    tagline: stripHtml(event.sub_heading) || fallback?.tagline || opener || firstSentence(description),
    duration: event.duration ? String(event.duration) : countOf(event.number_of_days, 'day') || countOf(event.number_of_hours, 'hour') || fallback?.duration || 'Contact us for duration',
    image: coverOf(event) || fallback?.image || '/images/bond-safari.webp',
    imagePosition: coverOf(event) ? undefined : fallback?.imagePosition,
    location: event.event_location ? tidyCaps(event.event_location) : fallback?.location || 'Kovalam',
    meetingPoint: event.meetingpoint || undefined,
    mapLink: /^https?:\/\//i.test(event.link_howToReach ?? '') ? event.link_howToReach! : undefined,
    ageLimit: event.minimum_age ? `${event.minimum_age} years` : undefined,
    difficulty: event.difficulty_level?.[0],
    eyebrow: fallback?.eyebrow || 'Bond Safari, Kovalam',
    details: fallback?.details ?? blocks(event.inclusions),
    overview: fallback?.overview ?? (opener ? about.slice(1) : about.length ? about : [description]),
    // Activities with their own catalogue copy keep it; the rest show what the CMS holds
    highlights: fallback ? undefined : highlightsOf(event.Trip_Highlights),
    notes: [section('Who it’s for', event.who_for), section('Not included', event.exclusions), section('Good to know', event.other_info), section('What to bring', event.carry)].filter(note => note.items.length),
    policies: [section('Terms & conditions', event.termsncondition), section('Cancellation policy', event.cancelation_policy)].filter(policy => policy.items.length),
    price: amount ? `₹${amount.toLocaleString('en-IN')} per person` : fallback?.price,
    minPeople: fallback?.minPeople,
    maxPeople: Number(event.group_size) || fallback?.maxPeople,
  }
}

// A catalogue activity with its API event's price, duration, photo and policies; its URL, name, tagline and location stay the site's
export const catalogueEvent = (e: Experience, event: EventRecord): Experience => ({ ...eventToExperience(event, e), slug: e.slug, title: e.title, tagline: e.tagline, location: e.location })
// The Activities page's filter group for an event the catalogue doesn't have, read from its name
const categoryOfName = (name: string) =>
  /combo|package|\+|&|\band\b|\d\s*-?\s*in\s*-?\s*1/i.test(name) ? 'Combo'
  : /scuba|dive|diving/i.test(name) ? 'Scuba diving'
  : /snorkel/i.test(name) ? 'Snorkeling'
  : /kayak/i.test(name) ? 'Kayaking'
  : /parasail/i.test(name) ? 'Parasailing'
  : 'Boating'

// What the site lists: the catalogue's activities, in its order, that have a published API event, then every other published event
// the API has, so a new activity shows as soon as the team publishes it. Without the API the whole catalogue stands in
export const activitiesFrom = (events: EventRecord[]) => {
  const published = events.filter(x => x.publish !== false)
  if (!published.length) return experiences
  const fromCatalogue = experiences.flatMap(e => {
    const event = published.find(x => x.slug === apiSlugOf(e.slug))
    return event ? [catalogueEvent(e, event)] : []
  })
  const taken = new Set([...experiences.map(e => e.slug), ...experiences.map(e => apiSlugOf(e.slug))])
  const extra = published.filter(x => !taken.has(x.slug)).map(x => ({ ...eventToExperience(x), category: categoryOfName(x.name) }))
  return [...fromCatalogue, ...extra]
}
