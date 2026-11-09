// Search landing pages. Copy only restates facts already in the catalogue; prices and products are pulled live
// from data/experiences.ts and data/courses.ts so they can't drift.
// Not built yet: "surfing lessons Kovalam" — waiting for surfing products (see pendingProducts).

export type Landing = {
  slug: string
  title: string
  description: string
  eyebrow: string
  heading: [string, string]
  intro: string[]
  image: string
  products: string[]
  // Show a comparison table of prices for these products
  priceTable?: boolean
}

export const landingPages: Landing[] = [
  {
    slug: 'scuba-diving-in-kerala',
    title: 'Scuba diving in Kerala — Kovalam dives, prices & PADI courses',
    description: 'Scuba diving in Kerala at Kovalam: first dives in the Arabian Sea from ₹4,500 with no swimming needed, monsoon freshwater dives, the Bond Safari underwater scooter and PADI courses.',
    eyebrow: 'Scuba diving in Kerala',
    heading: ['Scuba diving', 'in Kerala.'],
    intro: [
      'Bond Safari runs scuba diving at Kovalam, on Kerala’s coast near Thiruvananthapuram. First-timers can dive the Arabian Sea down to 12 m with a PADI Instructor or Divemaster beside them the whole way — no swimming ability needed.',
      'In the monsoon, when the sea is rough, we dive calm, rain-fed freshwater quarries instead. Want more than one dive? PADI courses run from Open Water to Instructor at our PADI 5 Star IDC.',
    ],
    image: '/images/scuba.webp',
    products: ['scuba-diving', 'freshwater-scuba', 'scuba-in-the-rain', 'dive-safari', 'open-water-diver', 'bond-safari'],
    priceTable: true,
  },
  {
    slug: 'scuba-diving-kovalam-price',
    title: 'Scuba diving in Kovalam — price list',
    description: 'Current scuba diving prices at Bond Safari Kovalam: Discover Scuba in the sea, freshwater dives, monsoon combos and PADI course fees, per person.',
    eyebrow: 'Prices · Kovalam',
    heading: ['Scuba diving prices', 'in Kovalam.'],
    intro: ['Every price is per person and includes the equipment listed on each activity. Where taxes are included, it says so next to the price. Prices for products marked “on request” are confirmed when you book.'],
    image: '/images/freshwater-scuba-dive.webp',
    products: ['scuba-diving', 'freshwater-scuba', 'scuba-in-the-rain', 'monsoon-combo', 'bond-safari', 'dive-safari', 'open-water-diver', 'advanced-open-water'],
    priceTable: true,
  },
  {
    slug: 'padi-open-water-kerala',
    title: 'PADI Open Water course in Kerala — Kovalam, 4–5 days',
    description: 'Get PADI Open Water certified in Kerala at Bond Academy, Kovalam: 4–5 days of theory, confined water and open water dives, from age 10, ₹35,000 including taxes.',
    eyebrow: 'PADI Open Water · Kerala',
    heading: ['PADI Open Water', 'in Kerala.'],
    intro: [
      'The PADI Open Water Diver course at Bond Academy, Kovalam takes 4–5 days and combines theory, confined water skill sessions and open water dives. You need basic swimming (a 200 m swim or 300 m snorkel) and must be at least 10 — divers aged 10–14 earn the Junior Open Water certification.',
      'Once certified you can dive to 18 m (12 m for Junior Open Water Divers). From there the pathway continues to Advanced, Rescue, Divemaster and Instructor — or do it all in Zero to Hero.',
    ],
    image: '/images/course-open-water-hd.webp',
    products: ['open-water-diver', 'advanced-open-water', 'zero-to-hero', 'freediver'],
    priceTable: true,
  },
  {
    slug: 'things-to-do-in-kovalam',
    title: 'Things to do in Kovalam — water activities & prices',
    description: 'Things to do in Kovalam, Kerala: underwater scooter rides, scuba diving, snorkelling, kayaking, stand-up paddleboarding, coracle rides and monsoon freshwater adventures.',
    eyebrow: 'Things to do in Kovalam',
    heading: ['Things to do', 'in Kovalam.'],
    intro: ['Visiting Kovalam? Here’s everything you can do on and under the water with Bond Safari, from a one-hour coracle ride to your first scuba dive. All activities include the equipment you need, and age limits are listed on each one.'],
    image: '/images/coracle-ride.webp',
    products: ['scuba-diving', 'snorkeling', 'parasailing', 'snorkel-kayak-cove', 'kayaking', 'stand-up-paddleboarding', 'coracle-rides', 'sea-life-safari', 'monsoon-combo', 'bond-safari'],
    priceTable: true,
  },
]
