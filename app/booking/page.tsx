import { BookingFlow } from '@/components/booking/booking'
import { pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'Book your adventure | Bond Safari', description: 'Choose a date, your group and your activities in Kovalam. Pay securely online, or send your request to our team on WhatsApp.', path: '/booking' })
// Keyed by the link, so a new Book link (e.g. from the header while already here) starts a fresh booking
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const q = await searchParams; return <BookingFlow key={JSON.stringify(q)} /> }
