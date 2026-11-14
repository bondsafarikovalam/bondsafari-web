// logout.world's booking widget, used only for its "Download Itinerary" form: the guest leaves their details with
// logout.world and gets the event's PDF. The widget runs with showEverything: false, so its own price box and
// Book Now / Enquire / Itinerary buttons are never shown (display: none); our brochure button opens its form
// instead, through the widget's downloadBtnId. Browser only.
//
// The widget only links an outside button whose id is NOT its default "logout-download-button" (that id is for its
// own hidden button), so ours has its own id. btnId and enquiryBtnId stay at their defaults, which the widget skips,
// so it never takes over the site's Book Now buttons (those open the separate logout.world checkout).
//
// logout.world's loader (static/widget/logout-booking.js) does two things: it asks which widget version an event
// uses, then loads that version's script and starts it. It can only start once per page load, and the site
// changes pages without reloading, so the same two steps are done here: the version script loads once, and the
// widget is started again for each brochure button that appears.

const ORIGIN = 'https://logout.world'
export const DOWNLOAD_BTN_ID = 'bond-brochure-download'

// The embed code logout.world supplied, apart from downloadBtnId (see above) and placement (set per page)
const CONFIG = {
  customClass: 'btn-custom',
  btnId: 'logout-bnb',
  downloadBtnId: DOWNLOAD_BTN_ID,
  enquiryBtnId: 'logout-enquiry-button',
  showEverything: false,
  onlyButton: false,
  showItineraryButton: true,
  showEnquiryButton: true,
  bookNowButtonColor: '#E8B04B',
  itineraryButtonColor: '#1B8A8F',
  booknowButtonName: 'Book Now',
  itineraryButtonName: 'Itinerary',
}

type Widget = { setConfig: (options: Record<string, unknown>) => void; init: () => void; destroy?: () => void; loadRazorpay?: () => void }
declare global { interface Window { logout?: { widget?: Widget } } }

// The event's saved widget styling, as the loader reads it; only the fields the loader passes on are kept
type Styling = { version?: string | number } & Record<string, unknown>
const STYLED = ['booknowTextColor', 'itineraryTextColor', 'enquiryButtonName', 'enquiryButtonColor', 'enquiryTextColor'] as const

let loading: Promise<Styling> | undefined
const load = (eventSlug: string) => loading ??= (async () => {
  const res = await fetch(`${ORIGIN}/v3/get-widget-styling/${encodeURIComponent(eventSlug)}/`)
  if (!res.ok) throw new Error(`Widget styling ${res.status}`)
  const styling = await res.json() as Styling
  const version = Number(styling.version) === 2 ? 2 : 1
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${ORIGIN}/static/widget/v${version}/logout-booking.js`
    script.onload = () => resolve()
    script.onerror = () => { script.remove(); reject(new Error('Widget script failed to load')) }
    document.body.appendChild(script)
  })
  if (!window.logout?.widget) throw new Error('Widget unavailable')
  return styling
})().catch(e => { loading = undefined; throw e })

let host: HTMLDivElement | undefined
let mounted: { eventSlug: string; button: HTMLElement; ready: boolean; promise: Promise<void> } | undefined

// Starts the widget for an event and resolves once it is listening to this brochure button. A fresh host element
// each time: the widget looks the button up by id when it first mounts, so a new button needs a new mount
export function mountItinerary(eventSlug: string, button: HTMLElement) {
  if (mounted?.eventSlug === eventSlug && mounted.button === button) return mounted.promise
  const current = { eventSlug, button, ready: false } as NonNullable<typeof mounted>
  mounted = current
  return current.promise = (async () => {
    const styling = await load(eventSlug)
    if (mounted !== current) return
    const widget = window.logout!.widget!
    widget.destroy?.()
    host?.remove()
    host = document.createElement('div')
    host.id = 'logout-itinerary'
    document.body.appendChild(host)
    // Version 1 adds Razorpay's script on every start; the itinerary form doesn't need a second copy
    if (widget.loadRazorpay && document.querySelector('script[src*="checkout.razorpay.com"]')) widget.loadRazorpay = () => {}
    widget.setConfig({ ...Object.fromEntries(STYLED.map(k => [k, styling[k]])), ...CONFIG, eventSlug, placement: '#logout-itinerary' })
    widget.init()
    await rendered(host)
    current.ready = true
  })().catch(e => { if (mounted === current) mounted = undefined; throw e })
}

// Version 1 renders into the host and links the button straight after; version 2 renders inside a shadow root
async function rendered(el: HTMLElement) {
  for (let waited = 0; waited < 10000; waited += 50) {
    if (el.querySelector('.book-now-outer') || el.querySelector(':scope > div')?.shadowRoot) {
      await new Promise(r => setTimeout(r, 50))
      return
    }
    await new Promise(r => setTimeout(r, 50))
  }
  throw new Error('Widget did not render')
}

// True when the widget is listening to this brochure button for this event
export const itineraryReady = (eventSlug: string, button: HTMLElement) => !!mounted?.ready && mounted.eventSlug === eventSlug && mounted.button === button && !!host?.isConnected
