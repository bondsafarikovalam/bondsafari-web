'use client'

import { create } from 'zustand'
import { apiClient } from '@/lib/api/client'
import { activitiesFrom, apiSlugOf, type EventRecord, type EventsResponse } from '@/lib/api/events'
import { experiences, type Experience } from '@/data/experiences'
import { setActivityOptions, setCourseOptions } from '@/lib/booking/cart'
import type { ApiCourse } from '@/lib/api/courses'

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
      const liveCourses = apiClient.get<ApiCourse[]>('/courses').then(r => r.data).catch(() => [])
      const first = (await apiClient.get<EventsResponse>('/events', { params: { page: 1 } })).data
      const pages = await Promise.all(Array.from({ length: Math.max(0, first.total_pages - 1) }, (_, i) => apiClient.get<EventsResponse>('/events', { params: { page: i + 2 } }).then(r => r.data)))
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
