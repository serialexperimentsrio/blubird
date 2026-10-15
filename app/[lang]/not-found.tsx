'use client'

import { usePathname } from 'next/navigation'
import TransitionLink from '@/components/layout/TransitionLink'
import { DEFAULT_LANG, isLang } from '@/lib/lang'

export default function NotFound() {
	const segment = usePathname().split('/')[1]
	const lang = isLang(segment) ? segment : DEFAULT_LANG

	return (
		<div
			style={{
				color: 'var(--rb-color-bright)',
				fontFamily: 'var(--font-maru-monica)',
				textAlign: 'center',
			}}
		>
			<p style={{ fontSize: '1.5rem' }}>
				{lang === 'ja' ? '[ページが見つかりません]' : '[PAGE NOT FOUND]'}
			</p>
			<TransitionLink href={`/${lang}`} style={{ color: 'inherit', fontSize: '1.2rem' }}>
				{lang === 'ja' ? 'ホームに戻る' : 'BACK TO HOME'}
			</TransitionLink>
		</div>
	)
}
