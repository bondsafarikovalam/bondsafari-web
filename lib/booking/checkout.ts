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

// DEBUG (dev only): logs the checkout's catalog and the checkout's messages, to see how activities and courses differ
const CATALOG = `https://logout.world/checkout-api/v1/companies/${checkout.company}/widgets/${checkout.widget}/catalog/`
let debugged = false
async function logCatalog() {
  if (debugged || process.env.NODE_ENV === 'production') return
  debugged = true
  window.addEventListener('message', e => { if (e.origin === 'https://logout.world') console.log('[logout checkout] message', e.data) })
  try {
    const pages = []
    for (let page: number | null = 1; page; ) {
      const data = await (await fetch(`${CATALOG}?page=${page}`)).json()
      pages.push(data)
      page = data.pagination?.next_page ?? null
    }
    const events = pages.flatMap(p => p.events)
    console.log('[logout checkout] catalog response', { ...pages[0], events })
    console.table(events.map(e => ({ slug: e.slug, name: e.name, offering_type: e.offering_type, bookable: e.bookable, categories: e.categories.map((c: { slug: string }) => c.slug).join(', ') })))
  } catch (error) { console.log('[logout checkout] catalog failed', error) }
}

export async function openCheckout() {
  void logCatalog()
  await prepareCheckout()
  const widget = window.logoutCheckout
  if (!widget) throw new Error('Booking checkout is unavailable')
  widget.open({ companySlug: checkout.company, widgetId: checkout.widget })
}
