import { whatsappLink } from '@/data/site'
import { enquiryMessage, type Status } from '@/data/programmes'
import { apiSlugOf } from '@/lib/api/events'
import { courseEventSlugOf } from '@/lib/api/courses'

// What a Book / Enquire button does. Bookable items open the logout.world booking widget for their event (`book`);
// `href` is the WhatsApp enquiry, used when the widget can't open or the event takes enquiries only.
// Everything else goes straight to WhatsApp, labelled for what happens next.
export type CtaInfo = { href: string; label: string; external: boolean; book?: string }

const ctaLabel: Partial<Record<Status, string>> = { apply: 'Apply now', 'coming-soon': 'Register interest' }

// A page's event on logout.world: activities and courses whose event slug differs are mapped, the rest match
export const eventSlugOf = (slug: string, kind: 'activity' | 'course' = 'activity') => kind === 'course' ? courseEventSlugOf(slug) : apiSlugOf(slug)

// The event behind an /activities/… or /courses/… link
export const eventOfHref = (href: string) => {
  const [, section, slug] = href.split(/[?#]/)[0].split('/')
  return !slug ? undefined : section === 'courses' ? eventSlugOf(slug, 'course') : section === 'activities' ? eventSlugOf(slug) : undefined
}

export const ctaOf = (title: string, event: string | undefined, status: Status = 'bookable'): CtaInfo => {
  const href = whatsappLink(enquiryMessage(title))
  return status === 'bookable' && event
    ? { href, label: 'Book now', external: false, book: event }
    : { href, label: ctaLabel[status] ?? 'Enquire now', external: true }
}
