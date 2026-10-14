import type { Lang } from '@/lib/lang'

export const runtime = 'edge'

type Props = {
	params: Promise<{ lang: Lang }>
}

export default async function SchoolPage({ params }: Props) {
	const { lang } = await params

	return (
		<div
			style={{
				color: 'var(--color-bright)',
				fontFamily: 'var(--font-maru-monica)',
				textAlign: 'center',
			}}
		>
			<p style={{ fontSize: '1.5rem' }}>
				{lang === 'ja' ? '[近日公開]' : '[COMING SOON]'}
			</p>
		</div>
	)
}
