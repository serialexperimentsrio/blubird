import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageFrame from '@/components/layout/PageFrame'
import { isLang, siteTitle } from '@/lib/lang'

type Props = {
	params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lang } = await params
	return {
		title: siteTitle(isLang(lang) ? lang : 'ja'),
	}
}

export default async function LangLayout({
	children,
	params,
}: Props & {
	children: React.ReactNode
}) {
	const { lang } = await params
	if (!isLang(lang)) notFound()

	return <PageFrame lang={lang}>{children}</PageFrame>
}
