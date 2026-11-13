import { permanentRedirect } from 'next/navigation'
// News now lives on the Blog & News page; old links open it on the press coverage.
// The 301 for /news is sent by redirects.mjs before this page runs (a page can only answer 307/308);
// this stays as a permanent fallback in case that rule is ever removed
export default function Page(){permanentRedirect('/blog#news')}
