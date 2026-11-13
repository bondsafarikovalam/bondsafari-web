import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { describe, fetchPage, hasApiKey, withoutCourses } from '@/lib/api/events-server'

export const dynamic = 'force-dynamic'
// A CDN in front (CloudFront) may keep the answer for 5 minutes; the server keeps logout.world's for as long
const cached = { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' }

// Every page number is its own upstream call and cache entry, so only whole numbers 1–50 are accepted
// (well above the catalogue's real page count). A missing or empty value means page 1, as before
const MAX_PAGE = 50
const pageOf = (value: string | null) => {
  if (!value) return 1
  if (!/^[1-9]\d{0,2}$/.test(value)) return undefined
  const page = Number(value)
  return page <= MAX_PAGE ? page : undefined
}

export async function GET(request: NextRequest) {
  const page = pageOf(request.nextUrl.searchParams.get('page'))
  if (page === undefined) return NextResponse.json({ message: `Invalid page. Use a whole number from 1 to ${MAX_PAGE}.` }, { status: 400 })
  if (!hasApiKey('activities')) return NextResponse.json({ message: 'Events API is not configured.' }, { status: 503 })

  try {
    // The list also carries Bond Safari's courses; the Activities page shows activities only
    const data = await fetchPage('activities', page)
    return NextResponse.json({ ...data, results: await withoutCourses(data.results) }, { headers: cached })
  } catch (error) {
    // The upstream status (a rejected key shows as 401/403) stays in the server log. Visitors see 404 for a page past
    // the end of the list and 502 for any other upstream failure
    console.error(`Events API: page ${page} failed`, describe(error))
    if (axios.isAxiosError(error) && error.response?.status === 404) return NextResponse.json({ message: 'Page not found.' }, { status: 404 })
    if (axios.isAxiosError(error) && error.response) return NextResponse.json({ message: 'Events API request failed.' }, { status: 502 })
    return NextResponse.json({ message: 'Events API is unavailable.' }, { status: 502 })
  }
}
