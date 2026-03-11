'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import PageFrame from '@/components/Layout/PageFrame'
import MemoriesGrid from '@/components/Special/MemoriesGrid'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function MemoriesPage({ params }: Props) {
	const [isVisible, setIsVisible] = useState(false)
	const [lang, setLang] = useState<'en' | 'ja'>('en')

	useEffect(() => {
		params.then((resolvedParams) => {
			setLang(resolvedParams.lang)
		})
		const timer = setTimeout(() => setIsVisible(true), 50)
		return () => clearTimeout(timer)
	}, [params])

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<div
					style={{
						opacity: isFadingOut ? 0 : (isVisible ? 1 : 0),
						transition: 'opacity 0.3s ease-in-out',
					}}
				>
					<MemoriesGrid lang={lang} />
				</div>
			)}
		</PageFrame>
	)
}
