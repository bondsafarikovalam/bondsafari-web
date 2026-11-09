import { Experiences } from '@/components/pages/experiences'
import { listActivities } from '@/lib/api/events-server'

export const revalidate = 300
export const metadata = { title: 'Water Sports & Activities in Kovalam | Bond Safari', description: 'Underwater scooter rides, scuba diving, snorkelling, kayaking, coracle rides and sea life safaris in Kovalam, Kerala. No experience needed — book online.', alternates: { canonical: '/activities' } }
export default async function Page(){return <Experiences initial={await listActivities()}/>}
