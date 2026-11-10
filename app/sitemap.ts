import type { MetadataRoute } from 'next'
import { products, hrefOf } from '@/data/products'
import { landingPages } from '@/data/landing'
import { programmes } from '@/data/programmes'
import { posts, stories } from '@/data/blog'
import { abs } from '@/lib/seo'
import { listActivities, listCourses, listEvents } from '@/lib/api/events-server'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['/', '/activities', '/courses', '/booking', '/about', '/gallery', '/blog', '/contact']
  const known = new Set([...products.map(hrefOf), ...programmes.map(p => `/courses/${p.slug}`)])
  // Activities and courses that only the API has, so a newly published one is listed too
  const [activities, courses, events] = await Promise.all([listActivities(), listCourses(), listEvents()])
  // Unpublished activities are noindex, so they stay out too; without the API every catalogue page is listed
  const live = new Set(activities.map(a => `/activities/${a.slug}`))
  const listed = products.filter(p => p.kind === 'course' || !events.length || live.has(hrefOf(p)))
  const fromApi = [...activities.map(a => `/activities/${a.slug}`), ...courses.map(c => `/courses/${c.slug}`)].filter(href => !known.has(href))
  return [
    ...pages.map(p => ({ url: abs(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...fromApi.map(href => ({ url: abs(href), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...listed.map(p => ({ url: abs(hrefOf(p)), changeFrequency: 'weekly' as const, priority: 0.7, images: [abs(p.image)] })),
    ...programmes.map(p => ({ url: abs(`/courses/${p.slug}`), changeFrequency: 'monthly' as const, priority: p.status === 'referred' || p.status === 'experience' ? 0.4 : 0.6 })),
    ...posts.map(p => ({ url: abs(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: 'monthly' as const, priority: 0.6, images: [abs(p.image)] })),
    ...stories.map(s => ({ url: abs(`/news/${s.slug}`), changeFrequency: 'yearly' as const, priority: 0.4, images: [abs(s.image)] })),
    ...landingPages.map(l => ({ url: abs(`/${l.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
