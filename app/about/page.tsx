import { About } from '@/components/pages/about'
import { pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'About Bond Safari | PADI 5 Star Dive Centre in Kovalam', description: 'Meet the team behind Bond Safari and Bond Academy in Kovalam, Kerala — a PADI 5 Star Instructor Development Centre and Kerala Government training partner running ocean adventures since day one.', path: '/about' })
export default function Page(){return <About/>}
