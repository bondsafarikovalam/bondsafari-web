import 'server-only'
import axios from 'axios'
import { cache } from 'react'
import { BoundedMap } from '@/lib/bounded-map'
import { activitiesFrom, apiSlugOf, catalogueEvent, eventToExperience, type EventRecord, type EventsResponse, type LivePages } from '@/lib/api/events'
import { experiences } from '@/data/experiences'
import { courses } from '@/data/courses'
import { programmes } from '@/data/programmes'
import { checkout } from '@/data/site'
import { siteSlugOf, toApiCourse } from '@/lib/api/courses'

const listUrl = () => process.env.EVENTS_API_URL || 'https://logout.world/api/company/events/'

// One API, two companies: the key decides whose list comes back. Bond Safari's activities and the academy's courses
const apiKeys = { activities: 'EVENTS_API_KEY', courses: 'COURSES_API_KEY' } as const
export type Catalogue = keyof typeof apiKeys
export const hasApiKey = (catalogue: Catalogue) => !!process.env[apiKeys[catalogue]]
const headersOf = (catalogue: Catalogue) => ({ Accept: 'application/json', Authorization: `Bearer ${process.env[apiKeys[catalogue]]}` })

export const describe = (error: unknown) => axios.isAxiosError(error) ? error.response?.status ?? error.code : error

// logout.world answers in seconds, so its responses are kept in this server's memory for a few minutes instead of being
// fetched again for every page view. Requests that arrive together share one call; after the TTL the stale copy still
// answers at once while a fresh one loads, and it stays in use if logout.world is down.
// At most 500 answers are kept (list pages, catalogues and single events); past that the least recently used is dropped
const TTL = 5 * 60 * 1000
const kept = new BoundedMap<string, { at: number; value: unknown }>(500)
const loading = new Map<string, Promise<unknown>>()
function remember<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = kept.get(key)
  if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.value as T)
  let next = loading.get(key) as Promise<T> | undefined
  if (!next) {
    next = load().then(value => { kept.set(key, { at: Date.now(), value }); return value }).finally(() => loading.delete(key))
    loading.set(key, next)
  }
  if (!hit) return next
  next.catch(error => console.error(`Events API: refreshing ${key} failed, still serving the copy from ${new Date(hit.at).toISOString()}`, describe(error)))
  return Promise.resolve(hit.value as T)
}

export const fetchPage = (catalogue: Catalogue, page: number | string) => remember(`page:${catalogue}:${page}`, () => axios.get<EventsResponse>(listUrl(), { params: { page }, headers: headersOf(catalogue), timeout: 15000 }).then(r => r.data))

// Every event in a catalogue, in full. The detail endpoint returns only a few fields, so the copy and images come from here
const loadAll = async (catalogue: Catalogue) => {
  const first = await fetchPage(catalogue, 1)
  const rest = await Promise.all(Array.from({ length: Math.max(0, first.total_pages - 1) }, (_, i) => fetchPage(catalogue, i + 2)))
  return [first, ...rest].flatMap(page => page.results)
}
async function listAll(catalogue: Catalogue): Promise<EventRecord[]> {
  if (!hasApiKey(catalogue)) return []
  try {
    return await remember(`all:${catalogue}`, () => loadAll(catalogue))
  } catch (error) {
    // The pages fall back to the catalogue in data/, so a rejected key would otherwise go unnoticed
    console.error(`Events API: could not load ${catalogue}`, describe(error))
    return []
  }
}

// The checkout's catalog marks each event as an activity or a course (offering_type). It is public and lists only
// the events in the saved checkout widget, so events it doesn't cover are classified by the site's own course pages
type CatalogEvent = { slug: string; offering_type?: string; bookable?: boolean }
type CatalogPage = { events: CatalogEvent[]; pagination?: { next_page?: number | null } }
const catalogUrl = `https://logout.world/checkout-api/v1/companies/${checkout.company}/widgets/${checkout.widget}/catalog/`
const loadCatalog = async () => {
  const types = new Map<string, string>()
  const unbookable = new Set<string>()
  for (let page: number | null = 1; page; ) {
    const data: CatalogPage = (await axios.get<CatalogPage>(catalogUrl, { params: { page }, timeout: 15000 })).data
    data.events.forEach((e: CatalogEvent) => { if (e.offering_type) types.set(e.slug, e.offering_type); if (e.bookable === false) unbookable.add(e.slug) })
    page = data.pagination?.next_page ?? null
  }
  return Object.assign(types, { unbookable })
}
const offeringTypes = cache(async () => {
  try {
    return await remember('checkout-catalog', loadCatalog)
  } catch (error) {
    console.error('Checkout catalog: could not load offering types', describe(error))
    return Object.assign(new Map<string, string>(), { unbookable: new Set<string>() })
  }
})
const siteCourses = new Set([...courses, ...programmes].map(c => c.slug))
const looksLikeCourse = (e: EventRecord) => siteCourses.has(siteSlugOf(e.slug)) || /\b(course|mermaid|freediv\w*|divemaster|instructor)\b/i.test(`${e.slug.replace(/-/g, ' ')} ${e.name}`)
const isCourse = (e: EventRecord, types: Map<string, string>) => {
  const type = types.get(e.slug)
  return type ? type === 'course' : looksLikeCourse(e)
}
// Bond Safari's events API also returns its courses: they belong on the Courses page, not on Activities
export const isCourseEvent = cache(async (slug: string) => {
  const record = (await listAll('activities')).find(e => e.slug === slug)
  return !!record && isCourse(record, await offeringTypes())
})

export const withoutCourses = async (events: EventRecord[]) => {
  const types = await offeringTypes()
  return events.filter(e => !isCourse(e, types))
}

export const listEvents = cache(async () => {
  const [events, types] = await Promise.all([listAll('activities'), offeringTypes()])
  return events.filter(e => !isCourse(e, types))
})
// What the Activities page lists, so its first render already has the API's photos and prices
export const listActivities = cache(async () => activitiesFrom(await listEvents()))
// The Courses page lists exactly these: the academy's courses plus the published courses in Bond Safari's list
export const courseRecords = cache(async () => {
  const [academy, events, types] = await Promise.all([listAll('courses'), listAll('activities'), offeringTypes()])
  const known = new Set(academy.map(e => e.slug))
  const extra = events.filter(e => isCourse(e, types) && !known.has(e.slug))
  return [...academy, ...extra].filter(event => event.publish !== false)
})
export const listCourses = cache(async () => {
  const { unbookable } = await offeringTypes()
  return (await courseRecords()).map(e => toApiCourse(e, !unbookable.has(e.slug)))
})

// Which activity and course pages exist right now (see isLivePage); a list is null while the API returns nothing for it
export const livePages = cache(async (): Promise<LivePages> => {
  const [events, activities, courses] = await Promise.all([listEvents(), listActivities(), listCourses()])
  return {
    activities: events.length ? activities.map(a => `/activities/${a.slug}`) : null,
    courses: courses.length ? courses.map(c => `/courses/${c.slug}`) : null,
  }
})

// One event for its own page: the single-event endpoint has the current price and dates but none of the copy or images,
// so it goes over the list's record. Its empty fields are skipped, and if the call fails the page still has the list's
const fetchEvent = (catalogue: Catalogue, slug: string) => remember(`event:${catalogue}:${slug}`, () => axios.get<EventRecord>(`https://logout.world/api/event/${encodeURIComponent(slug)}/`, { headers: headersOf(catalogue), timeout: 15000 }).then(r => r.data))
export const getEventRecord = cache(async (catalogue: Catalogue, slug: string): Promise<EventRecord | undefined> => {
  if (!hasApiKey(catalogue)) return undefined
  const [listed, single] = await Promise.all([
    (catalogue === 'courses' ? courseRecords() : listEvents()).then(events => events.find(item => item.slug === slug)),
    fetchEvent(catalogue, slug).catch(() => undefined),
  ])
  if (!single) return listed
  return { ...listed, ...Object.fromEntries(Object.entries(single).filter(([, value]) => value !== null && value !== '')) } as EventRecord
})

export async function getEvent(slug: string) {
  const e = experiences.find(item => item.slug === slug)
  const record = await getEventRecord('activities', apiSlugOf(slug))
  if (!record) return undefined
  if (!e) return eventToExperience(record)
  return record.publish === false ? e : catalogueEvent(e, record)
}
