import { notFound } from 'next/navigation'
import { experiences } from '@/data/experiences'
import { courseNext, homeCategoryOf, levelOf, listingOf, sectionOf, statusOf } from '@/data/programmes'
import { Detail, type RelatedItem } from '@/components/pages/detail'
import { JsonLd, breadcrumbLd } from '@/lib/seo'
import { getEvent, listActivities, listEvents } from '@/lib/api/events-server'
import { coverIn } from '@/lib/api/events'

export const dynamic = 'force-dynamic'
export const generateStaticParams = () => experiences.map(e => ({ slug: e.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = (await getEvent(slug)) ?? experiences.find(x => x.slug === slug)
  return { title: e ? `${e.title} | Bond Safari` : 'Activity | Bond Safari', description: e?.description, alternates: { canonical: `/activities/${slug}` } }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const staticExperience = experiences.find(x => x.slug === slug)
  const e = (await getEvent(slug)) ?? staticExperience
  if (!e) notFound()
  const cat = homeCategoryOf(slug)
  const section = staticExperience ? sectionOf(slug) : { label: 'Activities', href: '/activities' }
  // The rest of this activity's category first, then every other activity
  const slugs = [...new Set([...(cat?.groups.flatMap(g => g.items) ?? []), ...experiences.map(x => x.slug)])].filter(s => s !== slug)
  const fromCatalogue: RelatedItem[] = slugs.map(listingOf).filter(l => !!l && l.status === 'bookable').map(l => ({ title: l!.title, category: `${l!.type} · ${l!.level ?? l!.kind}`, image: l!.image, imagePosition: l!.imagePosition, price: l!.price, duration: l!.duration, tagline: l!.summary, href: l!.href }))
  // The same published events the Activities page lists; the catalogue only stands in when the API is unavailable
  const events = await listEvents()
  const cover = coverIn(events, slug)
  const fromApi: RelatedItem[] = (await listActivities()).filter(a => a.slug !== slug).map(a => ({ title: a.title, category: `Activity · ${a.difficulty ?? a.category}`, image: a.image, price: a.price, duration: a.duration, tagline: a.tagline, href: `/activities/${a.slug}` }))
  const related = fromApi.length ? fromApi : fromCatalogue
  const listing = listingOf(slug) ?? { location: e.location ?? 'Kovalam', level: e.category }
  const next = courseNext[slug] ? listingOf(courseNext[slug]) : undefined
  return <>
    <JsonLd data={breadcrumbLd([['Home', '/'], [section.label, section.href]])} />
    <Detail item={{ ...e, ...(cover && { image: cover, imagePosition: undefined }), type: 'Activity', status: statusOf(slug), level: levelOf(slug) ?? e.difficulty, location: listing.location, next: next && { title: next.title, href: next.href }, section }} related={related} />
  </>
}
