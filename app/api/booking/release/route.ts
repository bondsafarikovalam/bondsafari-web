import { backend, errorResponse } from '@/lib/booking/server'

// Frees held seats when the guest closes the payment window. Hold ids are random backend-issued tokens.
export async function POST(req: Request) {
  const { holdId } = await req.json().catch(() => ({})) as { holdId?: string }
  if (!holdId || typeof holdId !== 'string' || holdId.length > 64) return Response.json({ code: 'bad_request' }, { status: 400 })
  try {
    await backend(`holds/${encodeURIComponent(holdId)}/release`, { method: 'POST' })
    return Response.json({ ok: true })
  } catch (e) { return errorResponse(e) }
}
