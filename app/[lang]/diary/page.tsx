import Diary from '@/components/pagewise/Diary'
import type { Lang } from '@/lib/lang'

export const runtime = 'edge'

type Props = {
	params: Promise<{ lang: Lang }>
}

export default async function DiaryPage({ params }: Props) {
	const { lang } = await params

	return (
		<div style={{
			width: '100%',
			maxHeight: 'calc(100dvh - var(--header-height) - 3rem)',
			overflow: 'visible',
		}}>
			<Diary lang={lang} />
		</div>
	)
}
