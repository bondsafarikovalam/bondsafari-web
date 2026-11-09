// Shared catalogue types and helpers. Activities live in data/experiences.ts, courses in data/courses.ts;
// everything that prices, filters or books a product reads it through here so there is one source of truth.

// Sellers as listed on the current live booking platform (logout.world). Which legal entity invoices each
// product is still a business decision (see docs/launch-checklist.md); checkout shows this name.
export type Seller = 'Bond Safari Kovalam' | 'Bond Academy'

export type Faq = { q: string; a: string }

// Fields every bookable product shares. Optional fields are only filled from business-approved sources
// (the live site, the live booking catalogue, or copy already in this repo) — leave them out rather than guess.
export type ProductBase = {
  slug: string
  title: string
  description: string
  tagline: string
  overview: string[]
  details: string[]
  image: string
  imagePosition?: string
  // True when the photo is borrowed from another product and a real one is still needed
  imagePending?: boolean
  duration?: string
  // From-price per person in rupees, as published on the live booking catalogue
  amount?: number
  // 'included' only when the business's own product copy says taxes are included
  gst?: 'included'
  minAge?: number
  // Free-text eligibility where a plain number would mislead (e.g. "No age limit")
  ageNote?: string
  seller: Seller
  // The product's page on the booking platform in use today; offered only while online booking is not connected
  legacyBookingUrl?: string
  faqs?: Faq[]
  // Diving (incl. freediving and mermaid) has medical requirements: shows the medical note and checkout declaration
  medical?: boolean
  // Slugs (activities or courses) worth suggesting next — a logical next step, not the whole catalogue
  related?: string[]
}

export const inr = (n: number) => n.toLocaleString('en-IN')

// "₹4,500 per person" — the one price format used everywhere
export const priceLabel = (p: Pick<ProductBase, 'amount'>) => p.amount ? `₹${inr(p.amount)} per person` : undefined
export const taxLabel = (p: Pick<ProductBase, 'gst'>) => p.gst === 'included' ? 'incl. GST' : undefined
export const ageLabel = (p: Pick<ProductBase, 'minAge' | 'ageNote'>) => p.ageNote ?? (p.minAge ? `Min. age ${p.minAge}` : undefined)
