import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { FaqView } from '@/components/faq/faq-view'
import { faqGroups } from '@/data/faq'
import { contact, whatsappLink } from '@/data/site'

export function FaqPage() {
  return <main className="fq">
    <Header />
    <FaqView groups={faqGroups}>
      <section className="fq-more" aria-labelledby="fq-more-title">
        <h2 id="fq-more-title">Still have a question?</h2>
        <p>Our team is here every day, {contact.hours.split('·').pop()?.trim()}.</p>
        <div className="plan-actions">
          <a className="pill pill-dark" href={whatsappLink('Hello Bond Safari, I have a question.')} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp us</a>
          <Link className="pill pill-sand" href="/contact">Contact page <ArrowRight /></Link>
        </div>
      </section>
    </FaqView>
  </main>
}
