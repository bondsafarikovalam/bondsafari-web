import { Experiences } from '@/components/pages/experiences'
import { listActivities } from '@/lib/api/events-server'
import { JsonLd, itemListLd, pageMeta } from '@/lib/seo'

export const revalidate = 300
export const metadata = pageMeta({ title: 'Water Sports & Activities in Kovalam | Bond Safari', description: 'Scuba diving, snorkelling, kayaking, surfing, paddleboarding, coracle rides and combo packages in Kovalam, Kerala. No experience needed — book online.', path: '/activities', image: '/images/scuba.webp' })
export default async function Page() {
  const activities = await listActivities()
  return <><JsonLd data={itemListLd(activities.map(a => ({ name: a.title, path: `/activities/${a.slug}` })))} /><Experiences initial={activities} /></>
}
