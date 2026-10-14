import { notFound } from 'next/navigation'

export const runtime = 'edge'

// Unknown paths under /[lang] render app/[lang]/not-found.tsx inside the page frame
export default function CatchAll() {
	notFound()
}
