import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { landingPages } from '@/data/landing'
import { LandingPage } from '@/components/pages/landing'
import { JsonLd, breadcrumbLd } from '@/lib/seo'

// Search landing pages (/scuba-diving-in-kerala, /things-to-do-in-kovalam, …). Only the slugs listed in
// data/landing.ts exist; anything else at this level is a 404.
export const dynamicParams = false
export const generateStaticParams = () => landingPages.map(l => ({ landing: l.slug }))

export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }): Promise<Metadata> {
  const { landing } = await params
  const page = landingPages.find(l => l.slug === landing)
  if (!page) return {}
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` }, openGraph: { title: page.title, description: page.description, images: [page.image], url: `/${page.slug}` } }
}

export default async function Page({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params
  const page = landingPages.find(l => l.slug === landing)
  if (!page) notFound()
  return <><JsonLd data={breadcrumbLd([['Home', '/'], [page.eyebrow, `/${page.slug}`]])} /><LandingPage page={page} /></>
}
