import { redirect } from 'next/navigation'
// News now lives on the Blog & News page; old links open it on the press coverage
export default function Page(){redirect('/blog#news')}
