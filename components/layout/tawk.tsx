'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

type TawkWindow = typeof window & { Tawk_API?: { customStyle?: unknown; onLoad?: () => void; toggle?: () => void }; Tawk_LoadStart?: Date }

// tawk.to live chat: injects their embed script once, after the page is interactive.
// Their own launcher is hidden in globals.css; this fish opens and closes the chat instead
export function TawkChat() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!tawkPropertyId || !tawkWidgetId || document.getElementById('tawk-script')) return
    const w = window as TawkWindow
    w.Tawk_API = w.Tawk_API || {}
    // Bottom-right, where the site's own launcher sat; on phones it clears the sticky Book bar
    w.Tawk_API.customStyle = { visibility: { desktop: { position: 'br', xOffset: 24, yOffset: 24 }, mobile: { position: 'br', xOffset: 16, yOffset: 84 } } }
    w.Tawk_API.onLoad = () => setReady(true)
    w.Tawk_LoadStart = new Date()
    const s = document.createElement('script')
    s.id = 'tawk-script'
    s.async = true
    s.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`
    s.charset = 'UTF-8'
    s.setAttribute('crossorigin', '*')
    document.body.appendChild(s)
  }, [])
  if (!ready) return null
  return <button type="button" className="nemo-chat" aria-label="Chat with Nemo, your AI Ocean Buddy" onClick={() => (window as TawkWindow).Tawk_API?.toggle?.()}>
    <Image src="/images/nemo-chat-anim.webp" alt="" width={84} height={84} unoptimized />
  </button>
}
