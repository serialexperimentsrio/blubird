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
		slug: 'library',
		icon: 'book.svg',
		label: {
			en: 'LIBRARY',
			ja: 'ライブラリ',
		},
		description: {
			en: 'BOOKS I HAVE READ, FAVORITES, AND READING NOTES.',
			ja: '読んだ本やお気に入り、読書メモの記録。',
		},
	},
	{
		slug: 'projects',
		icon: 'gear.svg',
		label: {
			en: 'PROJECTS',
			ja: 'プロジェクト',
		},
		description: {
			en: 'ACTIVE AND ARCHIVED PERSONAL PROJECTS.',
			ja: '進行中のものや過去の個人プロジェクト。',
		},
	},
	{
		slug: 'f-and-f',
		icon: 'man.svg',
		label: {
			en: 'F&F',
			ja: '友達と家族',
		},
		description: {
			en: 'MEMORIES, NOTES, AND MOMENTS WITH FRIENDS AND FAMILY.',
			ja: '友達や家族との思い出や出来事の記録。',
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
			en: 'ARTWORKS BY ME, MY FRIENDS, AND MY FAMILY.',
			ja: '自分や友達、家族の作品をまとめた場所。',
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
			en: 'MUSIC I LISTEN TO, FAVORITES, AND PLAYLIST LOGS.',
			ja: '聴いた曲やお気に入り、プレイリストの記録。',
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
			en: 'MY WATCHED AND TO-WATCH MOVIES AND TV SHOWS',
			ja: '見た作品と、これから見たい映画やドラマ。',
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
