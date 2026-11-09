'use client'

import dynamic from 'next/dynamic'
import { ScrollPause } from '@/components/layout/scroll-pause'
import { TawkChat } from '@/components/layout/tawk'

// The booking popup isn't needed for first paint: load its code after the page is interactive
const BookingPopup = dynamic(() => import('@/components/booking/booking-popup').then(m => m.BookingPopup), { ssr: false })
// The between-pages loading screen is only needed once the visitor starts clicking around
const PageLoader = dynamic(() => import('@/components/layout/page-loader').then(m => m.PageLoader), { ssr: false })

export function Widgets() {
  return <><ScrollPause /><BookingPopup /><TawkChat /><PageLoader /></>
}
