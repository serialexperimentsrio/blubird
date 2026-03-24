'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import PageFrame from '@/components/shared/Layout/PageFrame'
import FAndF from '@/components/pagewise/Memories/Chapters/FAndF'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function FAndFPage({ params }: Props) {
	const [isVisible, setIsVisible] = useState(false)
	const [lang, setLang] = useState<'en' | 'ja'>('en')

	useEffect(() => {
		params.then((resolved) => setLang(resolved.lang))
		const timer = setTimeout(() => setIsVisible(true), 50)
		return () => clearTimeout(timer)
	}, [params])

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<div
					style={{
						opacity: isFadingOut ? 0 : isVisible ? 1 : 0,
						transition: 'opacity 0.3s ease-in-out',
					}}
				>
					<FAndF lang={lang} />
				</div>
			)}
		</PageFrame>
	)
}
