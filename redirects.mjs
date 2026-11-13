// Permanent (301) redirects from the old bondsafarikovalam.com URLs, checked against the live site on 2026-10-21.
// Each old page maps to its closest new equivalent; see docs/url-migration.md for the full table and the links
// that must be replaced outside the site (Instagram bio, Google Business Profile, QR codes) on cut-over day.
//
// Every rule points at the final page, so a visitor or crawler takes exactly one hop. Old WordPress links usually
// end in "/", so each rule also matches its trailing-slash form (Next's own slash-trimming redirect is replaced by
// `trailingSlash` below, which next.config.mjs puts after these rules).
//
// Deliberately NOT redirected:
//   /shop.html — there is no shop on the new site; it stays a 404.
//   Unknown URLs — they 404; nothing is sent to the home page.

const MAIN = 'https://www.bondsafarikovalam.com'
// The press coverage list. /news itself only forwards here (app/news/page.tsx), so rules point straight at it
const PRESS = '/blog#news'

// One rule, matching the URL with and without a trailing slash
const moved = (source, destination, extra = {}) => [
  { source, destination, statusCode: 301, ...extra },
  { source: `${source}/`, destination, statusCode: 301, ...extra },
]

// Press articles on the old site's root; each now has its own page under /news
const pressPages = [
  ['/A-pledge-taken-underwater-The-New-India-Express.html', '/news/a-pledge-taken-underwater-the-new-indian-express'],
  ['/top-executives-make-waves-hold-underwater-conference-in-Kerala-The-News-Minute.html', '/news/top-executives-make-waves-hold-underwater-conference-in-the-news-minute'],
  ['/top-executives-make-waves-hold-underwater-conference-in-kerala-the-news-minute.html', '/news/top-executives-make-waves-hold-underwater-conference-in-the-news-minute'],
  ['/you-would-love-to-know-why-these-top-5-Indian-CEOs-did-a-conference-under-water-NDTV.html', '/news/you-would-love-to-know-why-these-top-5-indian-ceos-did-a-ndtv'],
  ['/worlds-1st-underwater-CEO-conference-Took-Place-in-Kovalam-Trivandrum-Ente-City.html', '/news/worlds-1st-underwater-ceo-conference-took-place-in-kovalam-ente-city'],
]

const bookingsHost = [{ type: 'host', value: 'bookings.bondsafarikovalam.com' }]
const coursesHost = [{ type: 'host', value: 'courses.bondsafarikovalam.com' }]

export const legacyRedirects = [
  // Sea Life Safari is no longer offered (no published event), so its page and every old link to it go to Activities.
  // Listed before /experiences/:slug so the old /experiences link doesn't pass through /activities/sea-life-safari
  ...moved('/activities/sea-life-safari', '/activities'),
  ...moved('/experiences/sea-life-safari', '/activities'),
  ...moved('/sea-life-safari.html', '/activities'),

  // The section was renamed from Experiences to Activities; keep old links and search results working
  ...moved('/experiences', '/activities'),
  ...moved('/experiences/:slug', '/activities/:slug'),
  // Booking now happens in the logout.world checkout on each activity and course, so the old booking page lists the activities
  ...moved('/booking', '/activities'),

  ...moved('/index.html', '/'),
  ...moved('/about-us.html', '/about'),
  ...moved('/programs.html', '/activities'),
  ...moved('/dive-safari.html', '/activities/dive-safari'),
  // The swimming course isn't published in the API, so its page redirects to Courses; go there directly
  ...moved('/swimming-course.html', '/courses'),
  ...moved('/dive-course.html', '/courses'),
  ...moved('/gallery.html', '/gallery'),
  ...moved('/contact-us.html', '/contact'),
  // The new site's own /news URL: press coverage now lives on the Blog & News page (/news/<slug> pages are untouched)
  ...moved('/news', PRESS),
  ...moved('/news.html', PRESS),
  ...moved('/news.html/:page', PRESS),
  ...pressPages.flatMap(([source, destination]) => moved(source, destination)),
  // Other press and blog articles under /2017/… and /cgblog/…: their exact old URLs aren't known, so they go to the press page
  ...moved('/2017/:month(\\d{2})/:slug', PRESS),
  ...moved('/cgblog/:id(\\d+)/:slug', PRESS),

  // Old subdomains, straight to the final page on the main site. These only take effect once their DNS points at this deployment
  ...moved('/blogs', `${MAIN}${PRESS}`, { has: bookingsHost }),
  { source: '/:path*', has: bookingsHost, destination: `${MAIN}/activities`, statusCode: 301 },
  { source: '/:path*', has: coursesHost, destination: `${MAIN}/courses`, statusCode: 301 },
  // Bare domain ↔ www canonicalisation is left to the hosting/DNS config, which knows which host serves the app
]

// The removed /programmes category pages, sent to the matching section of Activities or Courses
export const programmeRedirects = [
  ...moved('/programmes', '/activities'),
  ...moved('/programmes/scuba-diving', '/courses#scuba-diving'),
  ...moved('/programmes/freediving', '/courses#freediving'),
  ...moved('/programmes/advanced-sports', '/courses'),
  ...moved('/programmes/:category', '/activities'),
]

// Next.js trims a trailing slash with its own 308 before any rule above runs, which would add a hop to every old
// WordPress link ("/about-us.html/" → "/about-us.html" → "/about"). next.config.mjs turns that off and puts this
// rule last instead: same behaviour for every other URL, one 301 hop. ".well-known" paths are left alone, as Next does
export const trailingSlash = {
  source: '/:path((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/]+)/',
  destination: '/:path',
  statusCode: 301,
}
