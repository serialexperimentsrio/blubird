'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import PageFrame from '@/components/Layout/PageFrame'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function DiaryPage({ params }: Props) {
	const [isVisible, setIsVisible] = useState(false)
	const [lang, setLang] = useState<'en' | 'ja' | null>(null)

	useEffect(() => {
		params.then((resolvedParams) => {
			setLang(resolvedParams.lang)
		})
		const timer = setTimeout(() => setIsVisible(true), 50)
		return () => clearTimeout(timer)
	}, [params])

	const comingSoonText = lang === 'ja' ? '[近日公開]' : '[COMING SOON]'

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<div
					style={{
						color: 'var(--white)',
						fontFamily: 'var(--font-maru-monica)',
						textAlign: 'center',
						opacity: isFadingOut ? 0 : (isVisible ? 1 : 0),
						transition: 'opacity 0.3s ease-in-out',
					}}
				>
					<p style={{ fontSize: '1.5rem' }}>
						{comingSoonText}
					</p>
				</div>
			)}
		</PageFrame>
	)
}
