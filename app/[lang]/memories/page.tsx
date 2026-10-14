import Memories from '@/components/pagewise/Memories'
import type { Lang } from '@/lib/lang'

export const runtime = 'edge'

type Props = {
	params: Promise<{ lang: Lang }>
}

export default async function MemoriesPage({ params }: Props) {
	const { lang } = await params
	return <Memories lang={lang} />
}
