import type { MetadataRoute } from 'next'
import { products, hrefOf } from '@/data/products'
import { landingPages } from '@/data/landing'
import { programmes } from '@/data/programmes'
import { posts, stories } from '@/data/blog'
import { abs } from '@/lib/seo'
import { listActivities, listCourses } from '@/lib/api/events-server'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['/', '/activities', '/courses', '/about', '/gallery', '/blog', '/faq', '/contact']
  // Activities and courses are the API's published ones only (other pages redirect to their list). Only when the API
  // returns nothing do the site's own catalogue pages stand in, matching what the pages themselves show then
  const [activities, courses] = await Promise.all([listActivities(), listCourses()])
  const offerings = [
    ...activities.map(a => ({ href: `/activities/${a.slug}`, image: a.image })),
    ...(courses.length
      ? courses.map(c => ({ href: `/courses/${c.slug}`, image: c.image }))
      : [...products.filter(p => p.kind === 'course').map(p => ({ href: hrefOf(p), image: p.image })), ...programmes.map(p => ({ href: `/courses/${p.slug}`, image: p.image }))]),
  ].filter((o, i, all) => all.findIndex(x => x.href === o.href) === i)
  return [
    ...pages.map(p => ({ url: abs(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...offerings.map(o => ({ url: abs(o.href), changeFrequency: 'weekly' as const, priority: 0.7, ...(o.image ? { images: [abs(o.image)] } : {}) })),
    ...posts.map(p => ({ url: abs(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: 'monthly' as const, priority: 0.6, images: [abs(p.image)] })),
    ...stories.map(s => ({ url: abs(`/news/${s.slug}`), changeFrequency: 'yearly' as const, priority: 0.4, images: [abs(s.image)] })),
    ...landingPages.map(l => ({ url: abs(`/${l.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
