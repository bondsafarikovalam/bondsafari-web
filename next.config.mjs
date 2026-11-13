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
]

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
