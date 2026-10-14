import FAndF from '@/components/pagewise/Memories/Chapters/FAndF'
import type { Lang } from '@/lib/lang'

export const runtime = 'edge'

type Props = {
	params: Promise<{ lang: Lang }>
}

export default async function FAndFPage({ params }: Props) {
	const { lang } = await params
	return <FAndF lang={lang} />
}
