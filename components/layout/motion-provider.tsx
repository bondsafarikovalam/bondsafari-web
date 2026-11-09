'use client'

import { LazyMotion, domAnimation } from 'framer-motion'

// Components use the lightweight `m` elements; this supplies the animation features once for the whole app.
// `strict` makes any stray full `motion.*` element throw, so the heavier bundle can't creep back in.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
}

// Layout animations (filter grids) need the larger feature set; it loads only where it is used
const loadLayout = () => import('@/components/layout/motion-layout').then(r => r.default)
export function LayoutMotion({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadLayout}>{children}</LazyMotion>
}
