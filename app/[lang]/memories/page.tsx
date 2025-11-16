'use client'

export const runtime = 'edge';

import { useState, useEffect } from 'react'
import PageFrame from '@/components/Layout/PageFrame'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function MemoriesPage({ params }: Props) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 50)
		return () => clearTimeout(timer)
	}, [])

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
						[Coming Soon...]
					</p>
				</div>
			)}
		</PageFrame>
	)
}
