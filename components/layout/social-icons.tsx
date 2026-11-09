// Brand marks drawn inline (lucide no longer ships brand icons), keyed by the labels in data/site
const icons: Record<string, React.ReactNode> = {
  Instagram: <g fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></g>,
  Facebook: <path fill="currentColor" d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z" />,
  YouTube: <path fill="currentColor" fillRule="evenodd" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8l5.4 3.2-5.4 3.2Z" />,
  LinkedIn: <path fill="currentColor" d="M5 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.1 9.4h3.8V21H3.1V9.4Zm6.2 0h3.6v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V21h-3.8v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.3V9.4Z" />,
}

export const SocialIcon = ({ label }: { label: string }) => <svg viewBox="0 0 24 24" aria-hidden="true">{icons[label]}</svg>
