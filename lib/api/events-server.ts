import axios from 'axios'
import { cache } from 'react'
import { activitiesFrom, apiSlugOf, catalogueEvent, eventToExperience, type EventRecord, type EventsResponse } from '@/lib/api/events'
import { experiences } from '@/data/experiences'
import { toApiCourse } from '@/lib/api/courses'

const listUrl = () => process.env.EVENTS_API_URL || 'https://logout.world/api/company/events/'

// One API, two companies: the key decides whose list comes back. Bond Safari's activities and the academy's courses
const apiKeys = { activities: 'EVENTS_API_KEY', courses: 'COURSES_API_KEY' } as const
export type Catalogue = keyof typeof apiKeys
export const hasApiKey = (catalogue: Catalogue) => !!process.env[apiKeys[catalogue]]
const headersOf = (catalogue: Catalogue) => ({ Accept: 'application/json', Authorization: `Bearer ${process.env[apiKeys[catalogue]]}` })

export const fetchPage = (catalogue: Catalogue, page: number | string) => axios.get<EventsResponse>(listUrl(), { params: { page }, headers: headersOf(catalogue), timeout: 15000 }).then(r => r.data)

// Every event in a catalogue, in full. The detail endpoint returns only a few fields, so the copy and images come from here
async function listAll(catalogue: Catalogue): Promise<EventRecord[]> {
  if (!hasApiKey(catalogue)) return []
  try {
    const first = await fetchPage(catalogue, 1)
    const rest = await Promise.all(Array.from({ length: Math.max(0, first.total_pages - 1) }, (_, i) => fetchPage(catalogue, i + 2)))
    return [first, ...rest].flatMap(page => page.results)
  } catch (error) {
    // The pages fall back to the catalogue in data/, so a rejected key would otherwise go unnoticed
    console.error(`Events API: could not load ${catalogue}`, axios.isAxiosError(error) ? error.response?.status ?? error.code : error)
    return []
  }
}

export const listEvents = cache(() => listAll('activities'))
// What the Activities page lists, so its first render already has the API's photos and prices
export const listActivities = cache(async () => activitiesFrom(await listEvents()))
export const courseRecords = cache(async () => (await listAll('courses')).filter(event => event.publish !== false))
export const listCourses = cache(async () => (await courseRecords()).map(toApiCourse))

// One event for its own page: the single-event endpoint has the current price and dates but none of the copy or images,
// so it goes over the list's record. Its empty fields are skipped, and if the call fails the page still has the list's
const fetchEvent = (catalogue: Catalogue, slug: string) => axios.get<EventRecord>(`https://logout.world/api/event/${encodeURIComponent(slug)}/`, { headers: headersOf(catalogue), timeout: 15000 }).then(r => r.data)
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
