// Online booking through the logout.world checkout: one saved widget for the whole company, where the guest picks
// their activities and courses, date, group and pays. It opens as a modal over the page. Browser only.
import { checkout } from '@/data/site'

const LOADER = 'https://logout.world/checkout-api/v1/embed/logout-checkout.js'

type Checkout = { open: (options: { companySlug: string; widgetId: string }) => void }
declare global { interface Window { logoutCheckout?: Checkout } }

// Loaded on first use. The buttons don't carry the embed's data-logout-checkout-* attributes, because the embed
// restyles and relabels every such button; ours open it from code instead.
let loader: Promise<void> | undefined
export const prepareCheckout = () => loader ??= new Promise<void>((resolve, reject) => {
  if (window.logoutCheckout) return resolve()
  const script = document.createElement('script')
  script.src = LOADER
  script.onload = () => resolve()
  script.onerror = () => { loader = undefined; script.remove(); reject(new Error('Booking checkout failed to load')) }
  document.body.appendChild(script)
})

export async function openCheckout() {
  await prepareCheckout()
  const widget = window.logoutCheckout
  if (!widget) throw new Error('Booking checkout is unavailable')
  widget.open({ companySlug: checkout.company, widgetId: checkout.widget })
}
