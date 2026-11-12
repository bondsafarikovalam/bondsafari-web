import Image from '@/components/ui/photo'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { FaqBrowser } from '@/components/faq/faq-browser'
import { faqGroups } from '@/data/faq'
import { contact, whatsappLink } from '@/data/site'

export function FaqPage() {
  return <main className="fq">
    <Header />
    <section className="fq-hero">
      <div className="fq-hero-media" aria-hidden="true"><Image src="/images/quiet-blue.webp" alt="" fill sizes="100vw" priority /></div>
      <div className="fq-hero-shade" aria-hidden="true" />
      <p className="eyebrow light">FAQ · Kovalam, Kerala</p>
      <h1>Frequently asked<br /><i>questions.</i></h1>
      <p>Everything guests ask us before parasailing, snorkelling and scuba diving in Kovalam.</p>
    </section>
    <div className="fq-body">
      <FaqBrowser groups={faqGroups} />
      <section className="fq-more" aria-labelledby="fq-more-title">
        <h2 id="fq-more-title">Still have a question?</h2>
        <p>Our team is here every day, {contact.hours.split('·').pop()?.trim()}.</p>
        <div className="plan-actions">
          <a className="pill pill-dark" href={whatsappLink('Hello Bond Safari, I have a question.')} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp us</a>
          <Link className="pill pill-sand" href="/contact">Contact page <ArrowRight /></Link>
        </div>
      </section>
    </div>
  </main>
}
