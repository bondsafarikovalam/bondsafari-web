import { FaqPage } from '@/components/pages/faq'
import { allFaqs } from '@/data/faq'
import { JsonLd, breadcrumbLd, faqLd, pageMeta } from '@/lib/seo'
export const metadata = pageMeta({ title: 'FAQ: Parasailing, Snorkelling & Scuba Diving in Kovalam | Bond Safari', description: 'Parasailing, snorkelling and scuba diving FAQs for Bond Safari, Kovalam: swimming, minimum age, safety, equipment, weather and what to bring.', path: '/faq' })
export default function Page(){return <><JsonLd data={[breadcrumbLd([['Home', '/'], ['FAQ', '/faq']]), faqLd(allFaqs)]} /><FaqPage /></>}
