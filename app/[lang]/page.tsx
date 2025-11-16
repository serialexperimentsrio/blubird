'use client'

export const runtime = 'edge';

import PageFrame from '@/components/Layout/PageFrame'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function Home({ params }: Props) {
	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<>{/* TODO: Put some content here */}</>
			)}
		</PageFrame>
	)
}