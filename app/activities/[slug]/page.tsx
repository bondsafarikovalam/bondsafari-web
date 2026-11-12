import { notFound, permanentRedirect } from 'next/navigation'
import { siteSlugOf } from '@/lib/api/courses'
import { experiences } from '@/data/experiences'
import { courseNext, homeCategoryOf, levelOf, listingOf, sectionOf, statusOf } from '@/data/programmes'
import { Detail, type RelatedItem } from '@/components/pages/detail'
import { JsonLd, breadcrumbLd, offeringLd, pageMeta } from '@/lib/seo'
import { getEvent, getEventRecord, isCourseEvent, listActivities, listEvents } from '@/lib/api/events-server'
import { apiSlugOf, brochureOf, coverIn } from '@/lib/api/events'

export const dynamic = 'force-dynamic'
export const generateStaticParams = () => experiences.map(e => ({ slug: e.slug }))

// An activity the API lists but hasn't published (or has dropped) still opens from old links, but stays out of search.
// When the API can't be reached nothing is hidden
const isUnpublished = async (slug: string) => {
  const events = await listEvents()
  if (!events.length) return false
  const record = events.find(x => x.slug === apiSlugOf(slug))
  return !record || record.publish === false
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = (await getEvent(slug)) ?? experiences.find(x => x.slug === slug)
  if (!e) return { title: 'Activity | Bond Safari' }
  const cover = coverIn(await listEvents(), slug) ?? e.image
  return pageMeta({ title: `${e.title} in Kovalam | Bond Safari`, description: e.tagline && !e.description.startsWith(e.tagline) ? `${e.tagline} — ${e.description}` : e.description, path: `/activities/${slug}`, image: cover, noindex: await isUnpublished(slug) })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const staticExperience = experiences.find(x => x.slug === slug)
  // A course from Bond Safari's events list belongs on its Courses page
  if (!staticExperience && await isCourseEvent(slug)) permanentRedirect(`/courses/${siteSlugOf(slug)}`)
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
  // The published event's brochure from logout.world; without one the page makes its own PDF
  const record = await getEventRecord('activities', apiSlugOf(slug))
  const brochure = record && record.publish !== false ? brochureOf(record.slug) : undefined
  return <>
    <JsonLd data={[breadcrumbLd([['Home', '/'], [section.label, section.href], [e.title, `/activities/${slug}`]]), offeringLd({ kind: 'activity', name: e.title, description: e.description, image: cover ?? e.image, path: `/activities/${slug}`, price: e.price, seller: 'Bond Safari Kovalam' })]} />
    <Detail item={{ ...e, ...(cover && { image: cover, imagePosition: undefined }), type: 'Activity', status: statusOf(slug), level: levelOf(slug) ?? e.difficulty, location: listing.location, next: next && { title: next.title, href: next.href }, section, brochure }} related={related} />
  </>
}
