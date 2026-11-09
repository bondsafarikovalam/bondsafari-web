// Bond's Muziris locations, run as Muziris Heritage Water Trails by Bond Safari. They have their own live website,
// which handles the full details and booking; this site only introduces them and links out.
// Facts come from the Bond Safari Paddle Sports project (lib/locations.ts, lib/muziris-films.ts) and the
// Paddle Sports design brief; stand-up paddleboarding was confirmed by Bond. Nothing else is
// filled in: no prices, timings or session details here.

export type MuzirisLocation = {
  id: string
  slug: string
  name: string
  district: 'Ernakulam' | 'Thrissur'
  environment: string
  // Only where the brief confirms one; Kottapuram's meeting point has not been supplied
  meetingPoint?: string
  summary: string
  highlights: string[]
  image: { src: string; alt: string; position?: string }
  // The location's page on the live website (bondpaddlesports.com, supplied by Bond). The Explore More button only
  // appears when it is set, so a location without a confirmed URL never gets a guessed link
  website?: string
  // Google Maps place for the location, as supplied by Bond
  directionsUrl: string
  published: boolean
}

export const muzirisLocations: MuzirisLocation[] = [
  {
    id: 'muziris-north-paravur',
    slug: 'muziris-north-paravur',
    name: 'Muziris – North Paravur',
    district: 'Ernakulam',
    environment: 'Backwater',
    meetingPoint: 'Thattukadavu Jetty',
    summary: 'Kayaks and the heritage boat on the North Paravur backwaters, setting off from Thattukadavu Jetty.',
    highlights: ['Kayaking', 'Canoeing', 'Stand-up paddleboarding', 'Muziris Heritage Project waterways'],
    image: { src: '/images/muziris-north-paravur.webp', alt: 'Paddlers in life jackets kayaking on the North Paravur backwater beside a heritage boathouse' },
    website: 'https://bondpaddlesports.com/locations/muziris-north-paravur',
    directionsUrl: 'https://maps.google.com/?cid=2904874649917515051',
    published: true,
  },
  {
    id: 'muziris-kottapuram',
    slug: 'muziris-kottapuram',
    name: 'Muziris – Kottapuram',
    district: 'Thrissur',
    environment: 'Backwater',
    summary: 'The tour boat on the Kottapuram waterways past heritage sites, with kayaks setting off from the steps.',
    highlights: ['Kayaking', 'Canoeing', 'Stand-up paddleboarding', 'Muziris Heritage Project waterways'],
    image: { src: '/images/muziris-kottapuram.webp', alt: 'The Muziris tour boat, decorated with marigolds, cruising the Kottapuram waterway' },
    website: 'https://bondpaddlesports.com/locations/muziris-kottapuram',
    directionsUrl: 'https://maps.google.com/?cid=6336071224429363249',
    published: true,
  },
]
