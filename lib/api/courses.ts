import { listingOf, type Listing } from '@/data/programmes'
import { eventToExperience, type EventRecord } from '@/lib/api/events'

// The academy API's slugs for courses that already have a page here, so those URLs stay as they are
const siteSlugs: Record<string, string> = {
  'padi-open-water-diver-course': 'open-water-diver',
  'padi-advanced-open-water-diver-course': 'advanced-open-water',
  'emergency-first-response-course': 'emergency-first-response',
  'padi-rescue-diver-course': 'rescue-diver',
  'padi-divemaster-course': 'divemaster',
  'instructor-development-course-idc': 'instructor-development',
  'padi-freediver': 'freediver',
  'basic-mermaid-course': 'basic-mermaid',
  'padi-mermaid-course': 'mermaid',
  'padi-advanced-mermaid-course': 'advanced-mermaid',
}
export const siteSlugOf = (slug: string) => siteSlugs[slug] ?? slug
// The other way round: a course page's event on logout.world
export const courseEventSlugOf = (slug: string) => Object.keys(siteSlugs).find(k => siteSlugs[k] === slug) ?? slug

export type ApiCourse = { slug: string; eventSlug: string; section: string; title: string; image: string; price?: string; duration: string; summary: string }

// The Courses page category a new course joins, read from its name
const sectionOfName = (name: string) => /mermaid/i.test(name) ? 'mermaid' : /freediv/i.test(name) ? 'freediving' : /\btec\b/i.test(name) ? 'technical-diving' : 'scuba-diving'

export function toApiCourse(event: EventRecord): ApiCourse {
  const e = eventToExperience(event)
  return { slug: siteSlugOf(event.slug), eventSlug: event.slug, section: sectionOfName(event.name), title: e.title, image: e.image, price: e.price?.replace(' per person', ''), duration: e.duration, summary: e.tagline }
}

// The site's own listing with the API's price, duration and photo; its title, status and curated summary stay, so the Courses page reads the same whatever the API calls a course.
// A course published as Coming soon here stays that way until the team opens it
export function courseListing(c: ApiCourse): Listing {
  const base = listingOf(c.slug)
  return { ...(base ?? { href: `/courses/${c.slug}`, kind: 'Certification', type: 'Course', status: 'bookable', location: 'Kovalam' }), slug: c.slug, title: base?.title ?? c.title, image: c.image, imagePosition: undefined, summary: base?.summary ?? c.summary, price: c.price ?? base?.price, duration: c.duration }
}
export const liveListing = (live: ApiCourse[], slug: string) => { const c = live.find(x => x.slug === slug); return c ? courseListing(c) : listingOf(slug) }
