import { Hero } from '@/components/home/site'
import { TrustStrip } from '@/components/home/trust'
import { ExperienceStack } from '@/components/home/stack'
import { NextStep } from '@/components/home/next-step'
import { ExploreCarousel } from '@/components/home/explore'
import { PadiPathway } from '@/components/sections/pathway'
import { Reviews } from '@/components/home/reviews'
import { PressSection } from '@/components/home/press'
import { TeamSection } from '@/components/home/team'
import { HomeBar } from '@/components/home/home-bar'
import { MapSection } from '@/components/sections/map'
import { MuzirisSection } from '@/components/sections/muziris'
import { listActivities, listEvents } from '@/lib/api/events-server'
import { coverIn } from '@/lib/api/events'
import { experiences } from '@/data/experiences'

export const revalidate = 300

export default async function Home() {
  const events = await listEvents()
  const photos = Object.fromEntries(experiences.flatMap(e => { const cover = coverIn(events, e.slug); return cover ? [[`/activities/${e.slug}`, cover]] : [] }))
  return <main><Hero /><div className="home-body"><TrustStrip /><ExperienceStack initial={await listActivities()} /><NextStep /><ExploreCarousel photos={photos} /><PadiPathway eyebrow="Learn with Bond Academy" more /><Reviews /><PressSection /><TeamSection /><MuzirisSection /><MapSection eyebrow="Plan your visit" /><HomeBar /></div></main>
}
