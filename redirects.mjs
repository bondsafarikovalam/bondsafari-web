// Permanent (308) redirects from the old bondsafarikovalam.com URLs, checked against the live site on 2026-10-21.
// Each old page maps to its closest new equivalent; see docs/url-migration.md for the full table and the links
// that must be replaced outside the site (Instagram bio, Google Business Profile, QR codes) on cut-over day.
//
// Deliberately NOT redirected (decide before launch):
//   /shop.html — there is no shop on the new site; leave it to 404/410, or point it somewhere once decided.

const MAIN = 'https://www.bondsafarikovalam.com'

// Press articles on the old site's root, under /2017/… and /cgblog/…: kept as one press page so their backlinks still land somewhere relevant
const pressPages = [
  '/A-pledge-taken-underwater-The-New-India-Express.html',
  '/top-executives-make-waves-hold-underwater-conference-in-Kerala-The-News-Minute.html',
  '/top-executives-make-waves-hold-underwater-conference-in-kerala-the-news-minute.html',
  '/you-would-love-to-know-why-these-top-5-Indian-CEOs-did-a-conference-under-water-NDTV.html',
  '/worlds-1st-underwater-CEO-conference-Took-Place-in-Kovalam-Trivandrum-Ente-City.html',
]

export const legacyRedirects = [
  // The section was renamed from Experiences to Activities; keep old links and search results working
  { source: '/experiences', destination: '/activities', permanent: true },
  { source: '/experiences/:slug', destination: '/activities/:slug', permanent: true },

  { source: '/index.html', destination: '/', permanent: true },
  { source: '/about-us.html', destination: '/about', permanent: true },
  { source: '/programs.html', destination: '/activities', permanent: true },
  { source: '/sea-life-safari.html', destination: '/activities/sea-life-safari', permanent: true },
  { source: '/dive-safari.html', destination: '/activities/dive-safari', permanent: true },
  { source: '/swimming-course.html', destination: '/courses/swimming-course', permanent: true },
  { source: '/dive-course.html', destination: '/courses', permanent: true },
  { source: '/gallery.html', destination: '/gallery', permanent: true },
  { source: '/contact-us.html', destination: '/contact', permanent: true },
  { source: '/news.html', destination: '/news', permanent: true },
  { source: '/news.html/:page', destination: '/news', permanent: true },
  ...pressPages.map(source => ({ source, destination: '/news', permanent: true })),
  { source: '/2017/:month(\\d{2})/:slug', destination: '/news', permanent: true },
  { source: '/cgblog/:id(\\d+)/:slug', destination: '/news', permanent: true },

  // Old subdomains — these only take effect once their DNS points at this deployment
  { source: '/blogs', has: [{ type: 'host', value: 'bookings.bondsafarikovalam.com' }], destination: `${MAIN}/news`, permanent: true },
  { source: '/:path*', has: [{ type: 'host', value: 'bookings.bondsafarikovalam.com' }], destination: `${MAIN}/booking`, permanent: true },
  { source: '/:path*', has: [{ type: 'host', value: 'courses.bondsafarikovalam.com' }], destination: `${MAIN}/courses`, permanent: true },
  // Bare domain ↔ www canonicalisation is left to the hosting/DNS config, which knows which host serves the app
]
