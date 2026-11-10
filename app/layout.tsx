import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/layout/footer'
import { Widgets } from '@/components/layout/widgets'
import { MotionProvider } from '@/components/layout/motion-provider'
import { JsonLd, localBusinessLd, siteName, siteUrl } from '@/lib/seo'

const description = 'Scuba diving, snorkelling, kayaking, surfing and PADI diving courses in Kovalam, Kerala. Guided ocean adventures with all gear included — book online.'
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Bond Safari | Scuba Diving & Water Sports in Kovalam',
  description,
  applicationName: siteName,
  openGraph: { siteName, locale: 'en_IN', type: 'website', title: 'Bond Safari | Scuba Diving & Water Sports in Kovalam', description, images: [{ url: '/images/hero-poster.webp', alt: 'Bond Safari, Kovalam' }] },
  twitter: { card: 'summary_large_image' },
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#082D3A', width: 'device-width', initialScale: 1 }
const display = Jost({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-display' })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={display.variable}><body><JsonLd data={localBusinessLd()} /><MotionProvider>{children}<Footer /><Widgets /></MotionProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
