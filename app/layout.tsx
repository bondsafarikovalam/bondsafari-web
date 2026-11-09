import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/layout/footer'
import { Widgets } from '@/components/layout/widgets'
import { MotionProvider } from '@/components/layout/motion-provider'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: 'Bond Safari | Ocean adventures in Kovalam', description: 'Bond Safari underwater scooter rides, scuba diving, sea life safaris and swimming courses in Kovalam, Kerala.' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#082D3A', width: 'device-width', initialScale: 1 }
const display = Jost({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-display' })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={display.variable}><body><MotionProvider>{children}<Footer /><Widgets /></MotionProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
