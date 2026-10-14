'use client'
/* eslint-disable @next/next/no-img-element */

import { setModal } from 'ricebag'
import people, { type Person } from '@/data/people'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'
import Flags from './Flags'
import PersonModal from './PersonModal'

type Props = {
	lang: Lang
}

const COLUMNS = {
	en: ['NICK', 'RELATIONSHIP', 'MEMOIR', 'FROM'],
	ja: ['名前', '関係', '思い出', '出身'],
}

export default function FAndF({ lang }: Props) {
	const me = people.find((p) => p.isMe)
	const others = people.filter((p) => !p.isMe)
	const [nick, relationship, memoir, from] = COLUMNS[lang]

	const openModal = (person: Person) => {
		setModal(<PersonModal person={person} lang={lang} />)
	}

	const renderRow = (person: Person) => (
		<button
			key={person.nick}
			className={styles.listRow}
			onClick={() => openModal(person)}
		>
			<div className={styles.listAvatar}>
				<img src="/icons/man.svg" alt="" className={styles.avatar} />
			</div>
			<span className={styles.listNick}>{person.nick}</span>
			<div className={styles.listRoles}>
				{person.roles.map((r) => (
					<span key={r} className={styles.roleTag}>{r}</span>
				))}
			</div>
			<span className={styles.listMemoir}>{person.memoir[lang].length > 80 ? person.memoir[lang].slice(0, 80) + '...' : person.memoir[lang]}</span>
			<div className={styles.listFrom}>
				<Flags from={person.from} fallback={<span>—</span>} />
			</div>
		</button>
	)

	return (
		<section className={styles.container}>
			<div className={styles.roster}>
				<div className={styles.fixedTop}>
					{me && renderRow(me)}
					<div className={styles.listHeader}>
						<span style={{paddingLeft: 10}}>{nick}</span>
						<span />
						<span>{relationship}</span>
						<span className={styles.wideOnly}>{memoir}</span>
						<span className={styles.wideOnly}>{from}</span>
					</div>
				</div>
				<div className={styles.rosterInner}>
					{others.map((person) => renderRow(person))}
				</div>
			</div>
		</section>
	)
}
