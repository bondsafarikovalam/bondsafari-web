import { legacyRedirects, programmeRedirects, trailingSlash } from './redirects.mjs'

// Sent with every response. No Content-Security-Policy yet: the checkout, chat, maps and video embeds load from
// several origins, so a CSP needs testing in report-only mode first (see BOND_SAFARI_AWS_DEPLOYMENT_GUIDE.md)
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Other sites may not frame these pages; the booking checkout is a frame inside our page, which this doesn't affect
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy() },
]

// Content Security Policy, in REPORT-ONLY mode: browsers block nothing and only log a "[Report Only]" console message
// for anything outside this list. No report-uri is set yet, so violations show only in the browser console.
// Once a few weeks of browsing show no unexpected violations, the header can be renamed to Content-Security-Policy.
//   logout.world        booking checkout: loader script, its modal iframe, widget styling fetch and logo images
//   *.tawk.to + others  tawk.to live chat (script, styles, fonts, images, iframe, websocket), per tawk.to's CSP guidance
//   google.com          Google Maps embed (iframe)
//   youtube-nocookie    blog video embeds (iframe)
//   va.vercel-scripts   Vercel Analytics, only loaded on Vercel
// 'unsafe-inline' scripts: Next.js writes inline bootstrap scripts into every page, and nonces would need per-request
// rendering. 'unsafe-eval' is added only in `next dev`, whose hot reloading uses eval; production never gets it
function contentSecurityPolicy() {
  const dev = process.env.NODE_ENV === 'development'
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : []), 'https://logout.world', 'https://embed.tawk.to', 'https://*.tawk.to', 'https://cdn.jsdelivr.net', 'https://va.vercel-scripts.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://*.tawk.to', 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https://logout.world', 'https://*.tawk.to', 'https://cdn.jsdelivr.net', 'https://tawk.link', 'https://s3.amazonaws.com'],
    'font-src': ["'self'", 'https://*.tawk.to', 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://logout.world', 'https://*.tawk.to', 'wss://*.tawk.to'],
    'frame-src': ['https://logout.world', 'https://www.google.com', 'https://www.youtube-nocookie.com', 'https://*.tawk.to'],
    'frame-ancestors': ["'self'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
  }
  return Object.entries(directives).map(([name, sources]) => `${name} ${sources.join(' ')}`).join('; ')
}

// Preview and staging hosts must stay out of search results so they don't compete with the real domain.
// *.vercel.app previews are matched by host; any other staging deployment sets SITE_NOINDEX=true
const noindex = { key: 'X-Robots-Tag', value: 'noindex, nofollow' }

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A self-contained server in .next/standalone, for a container on AWS (App Runner / ECS). Other hosts ignore it
  output: 'standalone',
  poweredByHeader: false,
  images: {
    // Serve resized AVIF/WebP per screen size instead of the full-size originals
    formats: ['image/avif', 'image/webp'],
    // Our photos are fixed assets, so let the optimised copies stay cached for a month
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'logout.world', pathname: '/media/**' },
    ],
  },
  // Hero videos, posters and photos in public/ are otherwise served with max-age=0, so every visit re-checks them.
  // A week is safe for assets that rarely change; replace a file under a new name if it must update at once
  async headers() {
    const week = { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }
    return [
      { source: '/:path*', headers: [...securityHeaders, ...(process.env.SITE_NOINDEX === 'true' ? [noindex] : [])] },
      { source: '/:path*', has: [{ type: 'host', value: '(?<preview>.+)\\.vercel\\.app' }], headers: [noindex] },
      { source: '/videos/:path*', headers: [week] },
      { source: '/images/:path*', headers: [week] },
    ]
  },
  // Next's built-in slash-trimming redirect runs before every rule below and would add a hop to old links ending in "/".
  // It is replaced by the `trailingSlash` rule at the end of redirects(), which behaves the same with a single 301
  skipTrailingSlashRedirect: true,
  // Old bondsafarikovalam.com URLs, renamed sections and removed pages (all in redirects.mjs), each one hop, 301
  async redirects() {
    return [...legacyRedirects, ...programmeRedirects, trailingSlash]
  },
}

export default nextConfig
