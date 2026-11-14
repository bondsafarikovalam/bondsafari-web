import { LegalPage } from '@/components/pages/legal'
import { LEGAL_APPROVED, legalDoc } from '@/data/legal'
import { pageMeta } from '@/lib/seo'
const doc = legalDoc('terms-and-conditions')
// Kept out of search results until the policies are approved (see data/legal.ts)
export const metadata = pageMeta({ title: `${doc.title} | Bond Safari Kovalam`, description: doc.description, path: '/terms-and-conditions', noindex: !LEGAL_APPROVED })
export default function Page() { return <LegalPage doc={doc} /> }
