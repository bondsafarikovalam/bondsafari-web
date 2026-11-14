import 'server-only'
import { createHash } from 'node:crypto'
import { BoundedMap } from '@/lib/bounded-map'
import { siteUrl } from '@/lib/seo'

// Guards for public POST endpoints: a same-origin check and a per-client rate limit, both in this server's memory.
// They keep other websites and simple scripts from flooding the endpoint; a determined attacker can still forge headers,
// so a rate rule at the edge (AWS WAF / CloudFront) remains the stronger protection

// True when the request comes from a page on this site. Browsers send Origin with every POST; when a privacy tool has
// stripped it, Sec-Fetch-Site still tells a cross-site request apart, and a client that sends neither is left to the
// rate limit. Origin "null" (sandboxed frames, file pages) never matches
export function isSameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) {
    const site = req.headers.get('sec-fetch-site')
    return !site || site === 'same-origin'
  }
  let host: string
  try {
    host = new URL(origin).host.toLowerCase()
  } catch {
    return false
  }
  // The canonical domain, plus the host this request was addressed to (a preview, staging or localhost URL)
  const allowed = [new URL(siteUrl).host, req.headers.get('x-forwarded-host'), req.headers.get('host')]
  return allowed.some(h => !!h && h.split(',')[0].trim().toLowerCase() === host)
}

// The client's IP from the proxy headers, hashed so no address is kept in memory. The first X-Forwarded-For entry is
// the client as the first proxy saw it; when that header is missing every such request shares one bucket
export function clientKey(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip')?.trim() || 'unknown'
  return createHash('sha256').update(ip).digest('base64url').slice(0, 22)
}

// Fixed-window counter per key, holding at most 10,000 clients (the least recently seen are dropped first).
// Returns 0 when the request may go ahead, otherwise the seconds until the window resets
const windows = new BoundedMap<string, { start: number; count: number }>(10_000)
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = windows.get(key)
  if (!current || now - current.start >= windowMs) {
    windows.set(key, { start: now, count: 1 })
    return 0
  }
  current.count++
  return current.count > limit ? Math.max(1, Math.ceil((current.start + windowMs - now) / 1000)) : 0
}
