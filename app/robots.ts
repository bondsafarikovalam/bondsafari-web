import type { MetadataRoute } from 'next'
import { abs } from '@/lib/seo'

// A staging build (SITE_NOINDEX=true) asks every crawler to stay away; production allows all but the API
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_NOINDEX === 'true') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }], sitemap: abs('/sitemap.xml') }
}
