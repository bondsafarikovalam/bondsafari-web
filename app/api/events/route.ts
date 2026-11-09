import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPage, hasApiKey } from '@/lib/api/events-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!hasApiKey('activities')) return NextResponse.json({ message: 'Events API is not configured.' }, { status: 503 })

  try {
    return NextResponse.json(await fetchPage('activities', request.nextUrl.searchParams.get('page') || '1'))
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) return NextResponse.json({ message: 'Events API request failed.' }, { status: error.response.status })
    return NextResponse.json({ message: 'Events API is unavailable.' }, { status: 502 })
  }
}
