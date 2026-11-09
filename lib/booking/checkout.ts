// Online payment through the logout.world booking widget. It sells one event at a time and shows only its own Book
// button, so each event's widget sits mounted but hidden and our Pay button opens its checkout. Its modal attaches to
// <body>, which is why it still appears from a hidden host. Browser only.

const LOADER = 'https://logout.world/static/widget/logout-booking.js'
// Covers downloading the widget (about 3 MB) on a slow phone connection
const MOUNT_TIMEOUT = 30_000

// The event is on logout.world but takes enquiries only, so it has no checkout to open
export class NotBookable extends Error {}

type Widget = { setConfig: (config: Record<string, unknown>) => void; init: () => void }
declare global { interface Window { logout?: { widget?: Widget } } }

const configOf = (eventSlug: string, placement: string) => ({
  eventSlug, placement,
  customClass: 'btn-custom',
  btnId: 'logout-bnb',
  downloadBtnId: 'logout-download-button',
  enquiryBtnId: 'logout-enquiry-button',
  showEverything: true,
  onlyButton: false,
  showItineraryButton: true,
  showEnquiryButton: true,
  bookNowButtonColor: '#28a745',
  itineraryButtonColor: '#dc3545',
  booknowButtonName: 'Book Now',
  itineraryButtonName: 'Itinerary',
})

// The loader declares top-level classes, so a second copy on the page would throw
let loader: Promise<void> | undefined
const loadWidget = () => loader ??= new Promise<void>((resolve, reject) => {
  const script = document.createElement('script')
  script.src = LOADER
  script.onload = () => resolve()
  script.onerror = () => { loader = undefined; script.remove(); reject(new Error('Booking widget failed to load')) }
  document.body.appendChild(script)
})

// While an event loads the widget draws only its buttons, including a placeholder Book that an enquiry-only event then
// drops. Any other text is the event's name and price, so from then on the buttons are final.
const eventLoaded = (host: HTMLElement) => {
  const labels = [...host.querySelectorAll('button, a')].reduce((n, b) => n + (b.textContent?.length ?? 0), 0)
  return (host.textContent?.length ?? 0) > labels
}

const bookButton = (host: HTMLElement, deadline = Date.now() + MOUNT_TIMEOUT) => new Promise<HTMLElement>((resolve, reject) => {
  const check = () => {
    if (eventLoaded(host)) {
      const button = host.querySelector<HTMLElement>('#logout-bnb')
      return button ? resolve(button) : reject(new NotBookable('Event takes enquiries only'))
    }
    if (Date.now() > deadline) return reject(new Error('Booking widget did not start'))
    setTimeout(check, 100)
  }
  check()
})

async function mount(eventSlug: string) {
  await loadWidget()
  const host = document.createElement('div')
  host.id = `logout-widget-${eventSlug}`
  // Not display:none, which would stop the widget measuring itself; visibility also keeps it out of the tab order
  host.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;visibility:hidden'
  document.body.appendChild(host)
  try {
    const widget = window.logout?.widget
    if (!widget) throw new Error('Booking widget is unavailable')
    widget.setConfig(configOf(eventSlug, `#${host.id}`))
    widget.init()
    return await bookButton(host)
  } catch (error) { host.remove(); throw error }
}

// One at a time: until the first has mounted, the loader would ignore a second event
const mounted = new Map<string, Promise<HTMLElement>>()
let queue: Promise<unknown> = Promise.resolve()
export function prepareCheckout(eventSlug: string) {
  const known = mounted.get(eventSlug)
  if (known) return known
  const next = queue.catch(() => {}).then(() => mount(eventSlug))
  // A load failure may pass, so it can be tried again; an enquiry-only event won't change during this visit
  next.catch(error => { if (!(error instanceof NotBookable)) mounted.delete(eventSlug) })
  mounted.set(eventSlug, next)
  queue = next
  return next
}

export const openCheckout = async (eventSlug: string) => (await prepareCheckout(eventSlug)).click()
