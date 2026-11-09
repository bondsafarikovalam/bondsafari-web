import { contact, business, socials } from '@/data/site'
import { hrefOf, type Product } from '@/data/products'

// Canonical origin for metadata, sitemap and structured data. Set NEXT_PUBLIC_SITE_URL on staging/previews.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bondsafarikovalam.com').replace(/\/$/, '')
export const abs = (path: string) => `${siteUrl}${path}`

// Structured data is limited to facts the site already shows. Ratings are only emitted once real Google
// figures are configured in data/site.ts — never invented.
export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': abs('/#business'),
    name: 'Bond Safari Kovalam',
    url: siteUrl,
    image: abs('/images/hero-poster.webp'),
    logo: abs('/images/logo.webp'),
    telephone: contact.phones[0].replace(/\s/g, ''),
    email: contact.email,
    address: { '@type': 'PostalAddress', streetAddress: 'Suseela Tower, Beach Road, VRP XIX/553-A', addressLocality: 'Kovalam', addressRegion: 'Kerala', postalCode: '695527', addressCountry: 'IN' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '08:30', closes: '18:30' }],
    sameAs: socials.map(([, href]) => href),
    ...(business.google ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: business.google.rating, reviewCount: business.google.count } } : {}),
  }
}

export function productLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': p.kind === 'course' ? ['Product', 'Course'] : 'Product',
    name: p.title,
    description: p.description,
    image: abs(p.image),
    url: abs(hrefOf(p)),
    brand: { '@type': 'Brand', name: p.seller },
    ...(p.kind === 'course' ? { provider: { '@type': 'Organization', name: p.seller, sameAs: siteUrl } } : {}),
    ...(p.amount ? { offers: { '@type': 'Offer', price: p.amount, priceCurrency: 'INR', url: abs(`/booking?activity=${encodeURIComponent(p.title)}`), seller: { '@type': 'Organization', name: p.seller } } } : {}),
  }
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
}

export function breadcrumbLd(items: [string, string][]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })) }
}

export function JsonLd({ data }: { data: object | object[] }) {
  // JSON.stringify escapes quotes; "<" is escaped too so no string can close the script tag
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
