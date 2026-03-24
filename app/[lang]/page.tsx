'use client'

export const runtime = 'edge'

import { useState, useEffect, useRef } from 'react'
import PageFrame from '@/components/shared/Layout/PageFrame'
import VNDialog from '@/components/pagewise/Home/VNDialog'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

// Check and clear dialog state BEFORE component renders
// This ensures VNDialog doesn't see the old state
const isNavigating = typeof window !== 'undefined' ? sessionStorage.getItem('is-navigating') : null
if (typeof window !== 'undefined' && !isNavigating) {
	sessionStorage.removeItem('vn-dialog-seen')
}

export default function Home({ params }: Props) {
	const [dialogComplete, setDialogComplete] = useState(false)
	const [language, setLanguage] = useState<'en' | 'ja'>('ja')
	const hasInitialized = useRef(false)

	// Initialize language and manage VN dialog visibility on mount
	useEffect(() => {
		// Prevent double-execution in React StrictMode
		if (hasInitialized.current) return
		hasInitialized.current = true

		// Initialize language from route params
		const initLang = async () => {
			const resolvedParams = await params
			setLanguage(resolvedParams.lang)
		}
		initLang()

		// Determine if this is a fresh page load or client-side navigation
		const isNavigating = sessionStorage.getItem('is-navigating')

		if (!isNavigating) {
			// Fresh page load/refresh (already cleared above)
			setDialogComplete(false)
		} else {
			// Client-side navigation, clean up the flag now that we've checked it
			sessionStorage.removeItem('is-navigating')
		}

		// Clean up language toggle flag
		sessionStorage.removeItem('language-toggling')

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Ensure navigation flag is cleared on actual page unload (browser refresh/close)
	useEffect(() => {
		const handleBeforeUnload = () => {
			sessionStorage.removeItem('is-navigating')
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [])

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<>
					{!dialogComplete && (
						<VNDialog
							language={language}
							isFadingOut={isFadingOut}
							onComplete={() => setDialogComplete(true)}
						/>
					)}
					{/* Future homepage content can go here */}
				</>
			)}
		</PageFrame>
	)
}