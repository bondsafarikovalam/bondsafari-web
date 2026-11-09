import { Courses } from '@/components/pages/courses'
import { listCourses } from '@/lib/api/events-server'

export const revalidate = 300
export const metadata = { title: 'Mermaid, Freediving, Technical & Scuba Diving Courses in Kovalam | Bond Safari', description: 'Every Bond Water Sports Academy course in four categories — mermaid, freediving, technical diving and scuba diving, from first level to instructor training.', alternates: { canonical: '/courses' } }
export default async function Page(){return <Courses live={await listCourses()}/>}
