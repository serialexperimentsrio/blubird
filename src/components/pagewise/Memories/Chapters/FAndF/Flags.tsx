/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import type { Person } from '@/data/people'
import styles from './style.module.css'

const FLAG_MAP: Record<string, string> = {
	'BANGLADESH': 'bangladesh',
	'JAPAN': 'japan',
	'PALESTINE': 'palestine',
	'PEACE_BLUE': 'peace_blue',
	'SOUTH KOREA': 'south_korea',
	'SUDAN': 'sudan',
}

type Props = {
	from: Person['from']
	// Shown when no country has a flag
	fallback?: ReactNode
}

export default function Flags({ from, fallback = null }: Props) {
	const countries = from == null ? [] : Array.isArray(from) ? from : [from]
	const flags = countries.map((c) => FLAG_MAP[c.toUpperCase()]).filter(Boolean)
	if (flags.length === 0) return fallback

	return flags.map((f) => (
		<img
			key={f}
			src={`/icons/flags/${f}.png`}
			alt={f.replace(/_/g, ' ')}
			className={styles.flagIcon}
		/>
	))
}
