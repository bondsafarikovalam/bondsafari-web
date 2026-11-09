import { listCourses } from '@/lib/api/events-server'

export const dynamic = 'force-dynamic'

// The browser's view of the academy catalogue; the API key stays on the server
export async function GET() {
  return Response.json(await listCourses())
}
