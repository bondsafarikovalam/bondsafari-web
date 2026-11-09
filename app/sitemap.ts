import type { MetadataRoute } from 'next'
import { products, hrefOf } from '@/data/products'
import { landingPages } from '@/data/landing'
import { programmes } from '@/data/programmes'
import { posts, stories } from '@/data/blog'
import { abs } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/activities', '/courses', '/booking', '/about', '/gallery', '/blog', '/contact']
  return [
    ...pages.map(p => ({ url: abs(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...products.map(p => ({ url: abs(hrefOf(p)), changeFrequency: 'weekly' as const, priority: 0.7, images: [abs(p.image)] })),
    ...programmes.map(p => ({ url: abs(`/courses/${p.slug}`), changeFrequency: 'monthly' as const, priority: p.status === 'referred' || p.status === 'experience' ? 0.4 : 0.6 })),
    ...posts.map(p => ({ url: abs(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: 'monthly' as const, priority: 0.6, images: [abs(p.image)] })),
    ...stories.map(s => ({ url: abs(`/news/${s.slug}`), changeFrequency: 'yearly' as const, priority: 0.4, images: [abs(s.image)] })),
    ...landingPages.map(l => ({ url: abs(`/${l.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
