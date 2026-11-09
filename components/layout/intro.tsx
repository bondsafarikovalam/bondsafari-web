// Entrance animations for above-the-fold hero content, done in CSS (app/globals.css: in-fade, in-rise, in-mask).
// Unlike Framer Motion's `initial`, which the server renders as invisible until JavaScript loads, a CSS animation
// starts at first paint: the hero headline, text and buttons appear without waiting for hydration (better LCP on
// slow phones), with the same motion, timing and easing as before. Reduced motion shows them straight away.

type Vars = React.CSSProperties & Record<`--${string}`, string>

// Fade in, rising from y (or sliding from x) pixels; opacity only when both are 0
export const enter = ({ y = 0, x = 0, duration = 1, delay = 0 }: { y?: number; x?: number; duration?: number; delay?: number }) => ({
  className: x || y ? 'in-rise' : 'in-fade',
  style: { '--in-x': `${x}px`, '--in-y': `${y}px`, '--in-t': `${duration}s`, '--in-d': `${delay}s` } as Vars,
})

// A line of a hero title sliding up into view from behind its mask
export function Mask({ children, delay = 0, duration = 1.6, from = '105%', className = '' }: { children: React.ReactNode; delay?: number; duration?: number; from?: string; className?: string }) {
  return <span className={`mask ${className}`.trim()}><span className="mask-inner in-mask" style={{ '--in-from': from, '--in-t': `${duration}s`, '--in-d': `${delay}s` } as Vars}>{children}</span></span>
}
