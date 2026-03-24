import Link from 'next/link'
import styles from './style.module.css'

type MemoryCard = {
	slug: string
	icon: string
	fallbackIcon?: string
	label: {
		en: string
		ja: string
	}
	description: {
		en: string
		ja: string
	}
}

type Props = {
	lang: 'en' | 'ja'
}

const cards: MemoryCard[] = [
	{
		slug: 'f-and-f',
		icon: 'man.svg',
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
		fallbackIcon: 'thumbnail.svg',
		label: {
			en: 'EXHIBITION',
			ja: '展示室',
		},
		description: {
			en: 'CREATIVE WORK BY PEOPLE I KNOW AND LOVE.',
			ja: '自分の作品たち。大切な人たちのために作ってる。',
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
			ja: '今まで作ってきたものと、今作ってるもの。',
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
			ja: 'お気に入りの本たち。',
		},
	},
	{
		slug: 'music',
		icon: 'music.svg',
		fallbackIcon: 'music-note.svg',
		label: {
			en: 'MUSIC',
			ja: '音楽',
		},
		description: {
			en: 'SOUNDS THAT SOUND NICE.',
			ja: '気持ちよく響く音たち。',
		},
	},
	{
		slug: 'tv',
		icon: 'tv.svg',
		label: {
			en: 'TV',
			ja: '映画とドラマ',
		},
		description: {
			en: 'WHAT I\'VE WATCHED AND PLAN TO.',
			ja: '観てきたものと、これから観たいもの。',
		},
	},
]

export default function MemoriesGrid({ lang }: Props) {
	return (
		<section className={styles.grid} aria-label="Memories sections">
			{cards.map((card) => {
				const label = card.label[lang]
				const description = card.description[lang]

				return (
				<Link
					key={card.slug}
					href={`/${lang}/memories/${card.slug}`}
					className={styles.card}
					aria-label={`${label} - ${description}`}
				>
					<div className={styles.cardInner}>
						<div className={styles.cardFront}>
							<img
								src={`/icons/${card.icon}`}
								onError={(event) => {
									if (!card.fallbackIcon) return
									event.currentTarget.onerror = null
									event.currentTarget.src = `/icons/${card.fallbackIcon}`
								}}
								alt={`${label} icon`}
								className={styles.icon}
								loading="lazy"
							/>
							<h3>{label}</h3>
						</div>
						<div className={styles.cardBack}>
							<p>{description}</p>
						</div>
					</div>
				</Link>
				)
			})}
		</section>
	)
}
