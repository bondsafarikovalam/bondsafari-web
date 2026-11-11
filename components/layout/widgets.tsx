'use client'

import dynamic from 'next/dynamic'
import { ScrollPause } from '@/components/layout/scroll-pause'
import { TawkChat } from '@/components/layout/tawk'

// The between-pages loading screen is only needed once the visitor starts clicking around
const PageLoader = dynamic(() => import('@/components/layout/page-loader').then(m => m.PageLoader), { ssr: false })

export function Widgets() {
  return <><ScrollPause /><TawkChat /><PageLoader /></>
}
