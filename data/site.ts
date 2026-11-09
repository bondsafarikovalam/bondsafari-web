export const contact = {
  phones: ['+91 84484 48846'],
  email: 'enquiry@bondsafarikovalam.com',
  address: ['Suseela Tower, Beach Road', 'VRP XIX/553-A, Kovalam P.O.', 'Kovalam, Kerala 695527'],
  hours: 'Monday – Sunday · 8:30 AM – 6:30 PM',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bond+Safari+Kovalam+Suseela+Tower+Beach+Road',
  bookingUrl: 'http://bookings.bondsafarikovalam.com/',
  whatsapp: '918448448846',
}

// Trust facts for the home page strip. Leave a value null until it's confirmed from a real source:
// the strip shows only what's filled in (e.g. google: { rating: 4.8, count: 1200, url: 'https://g.page/…' })
export const business = {
  google: null as { rating: number; count: number; url: string } | null,
  since: null as number | null, // year Bond Safari started operating
  guestsServed: null as string | null, // e.g. '50,000+'
  registration: null as string | null, // Kerala Tourism / KATPS operator registration, as it should appear publicly
  tripadvisor: null as { rating: number; url: string } | null,
  weatherPolicy: null as string | null, // sea-condition rescheduling policy
}

// Where guests report on the day. Arrival time stays null until the business confirms it
export const meetingPoint = { name: 'Bond Safari Kovalam', address: contact.address.join(', '), arrival: null as string | null }

// Optional extras offered at checkout (photo pack, pickup…). Empty until the business supplies them with prices;
// `for` limits an add-on to some product slugs, `per` says whether it's charged per person or once per booking
export type AddOn = { id: string; label: string; amount: number; per: 'person' | 'booking'; for?: string[] }
export const addOns: AddOn[] = []

export const whatsappLink =(message: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`

export const socials = [
  ['Instagram', 'https://www.instagram.com/bond_safari_kovalam/'],
  ['Facebook', 'https://www.facebook.com/share/18i1magx36/'],
  ['YouTube', 'https://www.youtube.com/@bondsafarikovalam'],
  ['LinkedIn', 'https://www.linkedin.com/company/bondsafari/'],
] as const

// From the old homepage (no date or source). Replace with dated Google / TripAdvisor reviews: source and date show when set
export type Review = { name: string; title: string; text: string; source?: 'Google' | 'TripAdvisor'; date?: string; url?: string }

export const reviews: Review[] = [
  { name: 'Anjali Gopan', title: 'A must do', text: 'The experience was surreal. It’s a must do in Kovalam. Amazing people, amazing sea, amazing experience!' },
  { name: 'Athira Srijith', title: 'It’s amazing', text: 'It’s amazing and such a different experience… it’s another world. Thank you so much Jackson and his team for giving me such a wonderful experience.' },
  { name: 'Clara', title: 'Friendly and professional', text: 'Staff and owner Jackson super friendly and professional — it’s a cool brand new dive shop!' },
  { name: 'Aswani Dravid', title: 'So different', text: 'You will see a world so different. Try it, before you die!' },
  { name: 'Sunit Fenn', title: 'Go dive', text: 'Brilliant… Beautiful surreal experience… Go dive, one has to experience it.' },
]

export const press = [
  { topic: 'Underwater wedding', title: 'India’s first underwater wedding takes place in Kerala', outlets: ['The Economic Times', 'News18', 'Financial Express', 'The Asian Age', 'BuzzFeed', 'ScoopWhoop', 'India Times'] },
  { topic: 'Underwater CEO conference', title: 'World’s first underwater CEO conference held at Kovalam', outlets: ['The Times of India', 'NDTV', 'The News Minute', 'Technopark Today'] },
  { topic: 'Ocean conservation', title: 'Waging war on plastic waste under the sea', outlets: ['The New Indian Express'] },
  { topic: 'Ocean conservation', title: 'A pledge taken underwater', outlets: ['The New Indian Express'] },
  { topic: 'Features', title: 'Exploring the life underwater at Kovalam', outlets: ['Manorama Online'] },
  { topic: 'Features', title: 'Malayalis turn daredevils', outlets: ['Deccan Chronicle'] },
]
