import Link from 'next/link'
import styles from './style.module.css'

type MemoryCard = {
	label: string
	slug: string
	icon: string
	fallbackIcon?: string
	description: string
}

type Props = {
	lang: 'en' | 'ja'
}

const cards: MemoryCard[] = [
	{
		label: 'LIBRARY',
		slug: 'library',
		icon: 'book.svg',
		description: 'BOOKS I HAVE READ, FAVORITES, AND READING NOTES.',
	},
	{
		label: 'PROJECTS',
		slug: 'projects',
		icon: 'gear.svg',
		description: 'ACTIVE AND ARCHIVED PERSONAL PROJECTS.',
	},
	{
		label: 'F&F',
		slug: 'f-and-f',
		icon: 'man.svg',
		description: 'MEMORIES, NOTES, AND MOMENTS WITH FRIENDS AND FAMILY.',
	},
	{
		label: 'EXHIBITION',
		slug: 'exhibition',
		icon: 'gallery.svg',
		fallbackIcon: 'thumbnail.svg',
		description: 'ARTWORKS BY ME, MY FRIENDS, AND MY FAMILY.',
	},
	{
		label: 'MUSIC',
		slug: 'music',
		icon: 'music.svg',
		fallbackIcon: 'music-note.svg',
		description: 'MUSIC I LISTEN TO, FAVORITES, AND PLAYLIST LOGS.',
	},
	{
		label: 'TV',
		slug: 'tv',
		icon: 'tv.svg',
		description: 'MY WATCHED AND TO-WATCH MOVIES AND TV SHOWS',
	},
]

export default function MemoriesGrid({ lang }: Props) {
	return (
		<section className={styles.grid} aria-label="Memories sections">
			{cards.map((card) => (
				<Link
					key={card.slug}
					href={`/${lang}/memories/${card.slug}`}
					className={styles.card}
					aria-label={`${card.label} - ${card.description}`}
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
								alt={`${card.label} icon`}
								className={styles.icon}
								loading="lazy"
							/>
							<h3>{card.label}</h3>
						</div>
						<div className={styles.cardBack}>
							<p>{card.description}</p>
						</div>
					</div>
				</Link>
			))}
		</section>
	)
}
