'use client'

import { create } from 'zustand'
import { activitiesFrom, apiSlugOf, type EventRecord, type EventsResponse } from '@/lib/api/events'
import { experiences, type Experience } from '@/data/experiences'
import { setActivityOptions, setCourseOptions } from '@/lib/booking/cart'
import type { ApiCourse } from '@/lib/api/courses'

// The site's own /api routes (the API keys stay on the server). Plain fetch keeps axios out of the browser bundle;
// a request that hangs gives up after 15 s, like the server's calls to logout.world
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

type EventsState = {
  events: EventRecord[]
  activities: Experience[]
  loading: boolean
  error: string | null
  loaded: boolean
  fetchEvents: () => Promise<void>
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  activities: experiences,
  loading: false,
  error: null,
  loaded: false,
  fetchEvents: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })
    try {
      const liveCourses = getJson<ApiCourse[]>('/courses').catch(() => [])
      const first = await getJson<EventsResponse>('/events?page=1')
      const pages = await Promise.all(Array.from({ length: Math.max(0, first.total_pages - 1) }, (_, i) => getJson<EventsResponse>(`/events?page=${i + 2}`)))
      const records = [first, ...pages].flatMap(page => page.results).filter(event => event.publish !== false)
      const mapped = activitiesFrom(records)
      setActivityOptions(mapped.map(e => ({ ...e, eventSlug: records.some(r => r.slug === apiSlugOf(e.slug)) ? apiSlugOf(e.slug) : undefined })))
      setCourseOptions(await liveCourses)
      set({ events: records, activities: mapped, loading: false, loaded: true })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Unable to load activities.' })
    }
  },
}))
