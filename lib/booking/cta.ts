import { whatsappLink } from '@/data/site'
import { enquiryMessage, type Status } from '@/data/programmes'

// What a Book / Enquire button does. Bookable items open the logout.world checkout (`book`); `href` is the WhatsApp
// enquiry, used when the checkout can't open. Everything else goes straight to WhatsApp, labelled for what happens next.
export type CtaInfo = { href: string; label: string; external: boolean; book?: boolean }

const ctaLabel: Partial<Record<Status, string>> = { apply: 'Apply now', 'coming-soon': 'Register interest' }

export const ctaOf = (title: string, status: Status = 'bookable'): CtaInfo => {
  const href = whatsappLink(enquiryMessage(title))
  return status === 'bookable'
    ? { href, label: 'Book now', external: false, book: true }
    : { href, label: ctaLabel[status] ?? 'Enquire now', external: true }
}
