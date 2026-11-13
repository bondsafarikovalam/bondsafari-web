// Health check for the load balancer / App Runner. It answers from this server alone and never calls
// logout.world or S3, so an outage there doesn't take the site out of rotation
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ ok: true, uptime: Math.round(process.uptime()) }, { headers: { 'Cache-Control': 'no-store' } })
}
