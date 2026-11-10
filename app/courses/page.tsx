import { Courses } from '@/components/pages/courses'
import { listCourses } from '@/lib/api/events-server'
import { JsonLd, itemListLd, pageMeta } from '@/lib/seo'

export const revalidate = 300
export const metadata = pageMeta({ title: 'PADI Scuba, Freediving & Mermaid Courses in Kovalam | Bond Safari', description: 'PADI Open Water, Advanced, Rescue, Divemaster and IDC, plus freediving and mermaid courses at a PADI 5 Star IDC in Kovalam — from first level to instructor.', path: '/courses', image: '/images/course-open-water-hd.webp' })
export default async function Page() {
  const live = await listCourses()
  return <>{live.length > 0 && <JsonLd data={itemListLd(live.map(c => ({ name: c.title, path: `/courses/${c.slug}` })))} />}<Courses live={live} /></>
}
