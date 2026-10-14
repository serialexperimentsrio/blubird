import VNDialog from '@/components/pagewise/Home/VNDialog'
import type { Lang } from '@/lib/lang'

export const runtime = 'edge'

type Props = {
	params: Promise<{ lang: Lang }>
}

export default async function Home({ params }: Props) {
	const { lang } = await params
	return <VNDialog lang={lang} />
}
