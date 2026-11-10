import { notFound } from 'next/navigation'
import { courses } from '@/data/courses'
import { courseNext, homeCategoryOf, levelOf, listingOf, programmeOf, programmes, sectionOf, statusLabel, statusOf, typeOfKind, zeroToHeroStages } from '@/data/programmes'
import { Detail, type RelatedItem } from '@/components/pages/detail'
import { JsonLd, breadcrumbLd, faqLd } from '@/lib/seo'
import { courseRecords, getEventRecord, listCourses, listEvents } from '@/lib/api/events-server'
import { brochureOf, coverIn, eventToExperience, type EventRecord } from '@/lib/api/events'
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
  return { title: api || c ? `${api?.title ?? c?.title} | Bond Safari` : 'Course | Bond Safari', description: c?.description ?? api?.description, alternates: { canonical: `/courses/${slug}` } }
}

// The rest of the course's own category first (next level leading), then the remaining categories' courses
function relatedFor(slug: string, live: ApiCourse[], events: EventRecord[], next?: string): RelatedItem[] {
  const cat = homeCategoryOf(slug)
  const slugs = [...new Set([...(next ? [next] : []), ...(cat?.groups.flatMap(g => g.items) ?? [])])].filter(s => s !== slug)
  return slugs.map(s => liveListing(live, s)).filter(l => !!l).map(l => ({ title: l.title, category: l.status === 'bookable' ? l.type : `${l.type} · ${statusLabel[l.status]}`, image: coverIn(events, l.slug) ?? l.image, imagePosition: coverIn(events, l.slug) ? undefined : l.imagePosition, price: l.price, duration: l.duration, tagline: l.summary, href: l.href, status: l.status }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const section = sectionOf(slug)
  const crumbs = breadcrumbLd([['Home', '/'], [section.label, section.href]])
  const live = await listCourses()
  const events = await listEvents()
  const api = await apiCourse(slug)
  // The site keeps its structured copy; the title, price, duration, photo and policies are the API's
  const fresh = api && { title: api.title, price: api.price?.replace(' per person', ''), duration: api.duration, image: api.image, imagePosition: undefined, policies: api.policies, brochure: api.brochure }
  const c = courses.find(x => x.slug === slug)
  if (c) {
    const next = courseNext[slug] ? listingOf(courseNext[slug]) : undefined
    const requirements = [...(c.minAge ? [['Minimum age', c.minAge] as [string, string]] : []), ['Prerequisite', c.prerequisite] as [string, string]]
    // Zero to Hero is a programme of five stages: list them on its own page as well as on the Scuba page
    const training = slug === 'zero-to-hero' ? zeroToHeroStages.map(s => ({ title: listingOf(s.slug)!.title, text: s.text })) : undefined
    return <><JsonLd data={crumbs} /><Detail item={{ ...c, type: 'Course', status: statusOf(slug), level: levelOf(slug), category: c.level, eyebrow: c.minAge ? `Min. age ${c.minAge}` : c.eyebrow, location: 'Kovalam', requirements, training, next: next && { title: next.title, href: next.href }, section, ...fresh }} related={relatedFor(slug, live, events, courseNext[slug])} /></>
  }
  const p = programmeOf(slug)
  if (!p) {
    if (!api) notFound()
    return <><JsonLd data={crumbs} /><Detail item={{ ...api, type: 'Course', status: 'bookable', level: api.difficulty, category: 'Certification', section }} related={relatedFor(slug, live, events)} /></>
  }
  const next = p.next ? listingOf(p.next) : undefined
  return <>
    <JsonLd data={p.faqs?.length ? [crumbs, faqLd(p.faqs)] : crumbs} />
    <Detail item={{ ...p, type: typeOfKind(p.kind), level: levelOf(slug), category: p.kind, duration: p.duration ?? 'Schedule varies', eyebrow: statusLabel[p.status], next: next && { title: next.title, href: next.href }, section, ...fresh }} related={relatedFor(slug, live, events, p.next)} />
  </>
}
