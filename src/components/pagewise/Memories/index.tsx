/* eslint-disable @next/next/no-img-element */
import TransitionLink from '@/components/layout/TransitionLink'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'

type MemoryCard = {
	slug: string
	icon: string
	// Set once app/[lang]/memories/<slug> exists
	live?: boolean
	label: Record<Lang, string>
	description: Record<Lang, string>
}

type Props = {
	lang: Lang
}

const cards: MemoryCard[] = [
	{
		slug: 'f-and-f',
		icon: 'man.svg',
		live: true,
		label: {
			en: 'F&F',
			ja: '友達と家族',
		},
		description: {
			en: 'MY FRIENDS AND FAMILY.',
			ja: '友達と家族のこと。',
		},
	},
	{
		slug: 'exhibition',
		icon: 'gallery.svg',
		label: {
			en: 'EXHIBITION',
			ja: '展示室',
		},
		description: {
			en: 'CREATIVE WORK BY PEOPLE I KNOW AND LOVE.',
			ja: '知り合いや大切な人たちの作品。',
		},
	},
	{
		slug: 'workshop',
		icon: 'gear.svg',
		label: {
			en: 'WORKSHOP',
			ja: 'ワークショップ',
		},
		description: {
			en: 'THINGS I\'M BUILDING, PAST AND PRESENT.',
			ja: '今まで作ったものと、今作っているもの。',
		},
	},
	{
		slug: 'library',
		icon: 'book.svg',
		label: {
			en: 'LIBRARY',
			ja: 'ライブラリ',
		},
		description: {
			en: 'GREAT BOOKS AND GOOD READS.',
			ja: 'いい本と、読んで楽しい本。',
		},
	},
	{
		slug: 'music',
		icon: 'music-note.svg',
		label: {
			en: 'MUSIC',
			ja: '音楽',
		},
		description: {
			en: 'SOUNDS THAT SOUND NICE.',
			ja: '聴いていて心地いい音。',
		},
	},
	{
		slug: 'tv',
		icon: 'tv.svg',
		label: {
			en: 'TV',
			ja: 'テレビ',
		},
		description: {
			en: 'WHAT I\'VE WATCHED, PLAYED, AND PLAN TO.',
			ja: '観たもの、遊んだもの、気になっているもの。',
		},
	},
]

export default function MemoriesGrid({ lang }: Props) {
	const comingSoon = lang === 'ja' ? '[近日公開]' : '[COMING SOON]'

	return (
		<section className={styles.grid} aria-label={lang === 'ja' ? '思い出' : 'Memories'}>
			{cards.map((card) => {
				const label = card.label[lang]
				const description = card.description[lang]

				const inner = (
					<div className={styles.cardInner}>
						<div className={styles.cardFront}>
							<img src={`/icons/${card.icon}`} alt="" className={styles.icon} loading="lazy" />
							<h3>{label}</h3>
							{/* Touch screens can't hover to flip, so the description shows here instead */}
							<p className={styles.touchDescription}>{card.live ? description : comingSoon}</p>
						</div>
						<div className={styles.cardBack}>
							<p>{description}</p>
							{!card.live && <p>{comingSoon}</p>}
						</div>
					</div>
				)

				return card.live ? (
					<TransitionLink
						key={card.slug}
						href={`/${lang}/memories/${card.slug}`}
						className={styles.card}
						aria-label={`${label} - ${description}`}
					>
						{inner}
					</TransitionLink>
				) : (
					<div
						key={card.slug}
						className={`${styles.card} ${styles.soon}`}
						tabIndex={0}
					>
						{inner}
					</div>
				)
			})}
		</section>
	)
}
