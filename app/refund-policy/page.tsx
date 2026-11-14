import { LegalPage } from '@/components/pages/legal'
import { LEGAL_APPROVED, legalDoc } from '@/data/legal'
import { pageMeta } from '@/lib/seo'
const doc = legalDoc('refund-policy')
// Kept out of search results until the policies are approved (see data/legal.ts)
export const metadata = pageMeta({ title: `${doc.title} | Bond Safari Kovalam`, description: doc.description, path: '/refund-policy', noindex: !LEGAL_APPROVED })
export default function Page() { return <LegalPage doc={doc} /> }
