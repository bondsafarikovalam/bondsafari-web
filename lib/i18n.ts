// UI strings for the booking flow, keyed so Malayalam and Hindi can be dropped in without touching components.
// English is the complete reference. The ml/hi dictionaries are intentionally empty: they must be filled by a
// fluent reviewer (machine translation is not acceptable for booking, safety and payment wording). Missing keys
// fall back to English, so a partial translation never shows blank text.

export const locales = ['en', 'ml', 'hi'] as const
export type Locale = typeof locales[number]
export const localeNames: Record<Locale, string> = { en: 'English', ml: 'മലയാളം', hi: 'हिन्दी' }

const en = {
  stepActivity: 'Choose an activity',
  stepCourse: 'Choose a course',
  stepDate: 'Date & time',
  stepGuests: 'Guests',
  stepAddOns: 'Extras',
  stepDetails: 'Your details',
  stepPay: 'Review & pay',
  stepPrereq: 'Requirements',
  stepBatch: 'Choose a batch',
  continue: 'Continue',
  back: 'Back',
  adults: 'Adults',
  children: 'Children',
  perPerson: 'per person',
  total: 'Total',
  payNow: 'Pay now',
  balance: 'Balance before you start',
  inclGst: 'incl. GST',
  name: 'Full name (lead guest)',
  phone: 'WhatsApp number',
  email: 'Email',
  noSlots: 'No open slots on this day. Please try another date.',
  loading: 'Checking live availability…',
  seatsLeft: 'seats left',
  full: 'Full',
  closed: 'Closed',
  notConnectedTitle: 'Online booking isn’t connected yet',
  notConnectedBody: 'You can still choose your activity, date and guests here. We’ll send the request to our team, who will confirm availability and payment with you. Nothing is booked until they confirm.',
  sendWhatsApp: 'Send request on WhatsApp',
  sendRequest: 'Send request',
  legacyBooking: 'Or book on our current booking page',
  requestSentTitle: 'Request sent — not yet confirmed',
  requestSentBody: 'Our team will reply to confirm availability and how to pay. Your spot is held only once they confirm.',
  confirmedTitle: 'You’re booked.',
  pendingTitle: 'Payment processing',
  failedTitle: 'Payment didn’t go through',
  cancelledTitle: 'Payment cancelled',
  cancelledBody: 'You closed the payment window, so nothing was charged and your seats were released.',
  tryAgain: 'Try again',
  reference: 'Booking reference',
  meetingPoint: 'Meeting point',
  openMaps: 'Open in Maps',
  needHelp: 'Need help? Message us on WhatsApp',
}

export type Messages = typeof en

const ml: Partial<Messages> = {}
const hi: Partial<Messages> = {}

const dictionaries: Record<Locale, Partial<Messages>> = { en, ml, hi }

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v)
export const messages = (locale: Locale = 'en'): Messages => ({ ...en, ...dictionaries[locale] })
// A locale is offered to visitors only once its dictionary is complete
export const readyLocales = locales.filter(l => Object.keys(dictionaries[l]).length === Object.keys(en).length)
