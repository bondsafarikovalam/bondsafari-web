import { notFound, permanentRedirect } from 'next/navigation'
import { courses } from '@/data/courses'
import { courseNext, homeCategoryOf, levelOf, listingOf, programmeOf, programmes, sectionOf, statusLabel, statusOf, typeOfKind, zeroToHeroStages } from '@/data/programmes'
import { Detail, type RelatedItem } from '@/components/pages/detail'
import { JsonLd, breadcrumbLd, faqLd, offeringLd, pageMeta } from '@/lib/seo'
import { courseRecords, getEventRecord, listCourses, listEvents, livePages } from '@/lib/api/events-server'
import { brochureOf, coverIn, eventToExperience, isLivePage, type EventRecord, type LivePages } from '@/lib/api/events'
import { liveListing, siteSlugOf, type ApiCourse } from '@/lib/api/courses'

// Existing PADI courses and the freediving, mermaid and technical programmes share one /courses/[slug] route
export const generateStaticParams = () => [...courses, ...programmes].map(c => ({ slug: c.slug }))
export const revalidate = 300

// The API's record for a course, by its URL here
const apiCourse = async (slug: string) => {
  const listed = (await courseRecords()).find(x => siteSlugOf(x.slug) === slug)
  const record = listed && await getEventRecord('courses', listed.slug)
  return record && { ...eventToExperience(record), brochure: brochureOf(listed.slug) }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const api = await apiCourse(slug)
  const c = courses.find(x => x.slug === slug) ?? programmeOf(slug)
  const title = api?.title ?? c?.title
  if (!title) return { title: 'Course | Bond Safari' }
  return pageMeta({ title: `${title} in Kovalam | Bond Academy`, description: c?.description ?? api?.description, path: `/courses/${slug}`, image: api?.image ?? c?.image })
}

// The rest of the course's own category first (next level leading), then the remaining categories' courses
// Only pages the API publishes are suggested (see isLivePage)
function relatedFor(slug: string, pages: LivePages, live: ApiCourse[], events: EventRecord[], next?: string): RelatedItem[] {
  const cat = homeCategoryOf(slug)
  const slugs = [...new Set([...(next ? [next] : []), ...(cat?.groups.flatMap(g => g.items) ?? [])])].filter(s => s !== slug)
  return slugs.map(s => liveListing(live, s)).filter((l): l is NonNullable<typeof l> => !!l && isLivePage(pages, l.href)).map(l => ({ title: l.title, category: l.status === 'bookable' ? l.type : `${l.type} · ${statusLabel[l.status]}`, image: coverIn(events, l.slug) ?? l.image, imagePosition: coverIn(events, l.slug) ? undefined : l.imagePosition, price: l.price, duration: l.duration, tagline: l.summary, href: l.href, status: l.status }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const section = sectionOf(slug)
  const crumbsTo = (title: string) => breadcrumbLd([['Home', '/'], [section.label, section.href], [title, `/courses/${slug}`]])
  const course = (item: { title: string; description?: string; image?: string; price?: string }) => offeringLd({ kind: 'course', name: item.title, description: item.description, image: item.image, path: `/courses/${slug}`, price: item.price, seller: 'Bond Academy' })
  const live = await listCourses()
  // Only courses the API publishes have a page; an old link to any other lands on the Courses list.
  // When the API returns no courses at all (unreachable), the site's own courses stand in instead
  if (live.length && !live.some(x => x.slug === slug)) permanentRedirect('/courses')
  const pages = await livePages()
  // A "next step" link only to a page that exists
  const liveOnly = <T extends { href: string }>(l?: T) => l && isLivePage(pages, l.href) ? l : undefined
  const events = await listEvents()
  // A course the API lists is bookable or takes enquiries as the API says; otherwise the site's own status stands
  const liveCourse = live.find(x => x.slug === slug)
  const status = liveCourse ? (liveCourse.bookable ? 'bookable' as const : 'enquire' as const) : undefined
  const api = await apiCourse(slug)
  // The site keeps its structured copy; the title, price, duration, photo and policies are the API's
  const fresh = api && { title: api.title, price: api.price?.replace(' per person', ''), duration: api.duration, image: api.image, imagePosition: undefined, policies: api.policies, brochure: api.brochure }
  const c = courses.find(x => x.slug === slug)
  if (c) {
    const next = liveOnly(courseNext[slug] ? listingOf(courseNext[slug]) : undefined)
    const requirements = [...(c.minAge ? [['Minimum age', c.minAge] as [string, string]] : []), ['Prerequisite', c.prerequisite] as [string, string]]
    // Zero to Hero is a programme of five stages: list them on its own page as well as on the Scuba page
    const training = slug === 'zero-to-hero' ? zeroToHeroStages.map(s => ({ title: listingOf(s.slug)!.title, text: s.text })) : undefined
    const shown = { ...c, ...fresh }
    return <><JsonLd data={[crumbsTo(shown.title), course(shown)]} /><Detail item={{ ...c, type: 'Course', status: status ?? statusOf(slug), level: levelOf(slug), category: c.level, eyebrow: c.minAge ? `Min. age ${c.minAge}` : c.eyebrow, location: 'Kovalam', requirements, training, next: next && { title: next.title, href: next.href }, section, ...fresh }} related={relatedFor(slug, pages, live, events, courseNext[slug])} /></>
  }
  const p = programmeOf(slug)
  if (!p) {
    if (!api) notFound()
    return <><JsonLd data={[crumbsTo(api.title), course(api)]} /><Detail item={{ ...api, type: 'Course', status: status ?? 'bookable', level: api.difficulty, category: 'Certification', section }} related={relatedFor(slug, pages, live, events)} /></>
  }
  const next = liveOnly(p.next ? listingOf(p.next) : undefined)
  const shown = { ...p, ...fresh }
  // A programme that isn't open yet has no price to offer
  const ld = [crumbsTo(shown.title), ...((status ?? p.status) === 'bookable' || fresh ? [course(shown)] : []), ...(p.faqs?.length ? [faqLd(p.faqs)] : [])]
  return <>
    <JsonLd data={ld} />
    <Detail item={{ ...p, type: typeOfKind(p.kind), level: levelOf(slug), category: p.kind, duration: p.duration ?? 'Schedule varies', status: status ?? p.status, eyebrow: statusLabel[status ?? p.status], next: next && { title: next.title, href: next.href }, section, ...fresh }} related={relatedFor(slug, pages, live, events, p.next)} />
  </>
}
