import { Metadata } from 'next'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lang } = await params
	return {
		title: lang === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!",
	}
}

export default function LangLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}