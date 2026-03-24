'use client'

import { setModal } from '@/components/Modal'
import people from '@/data/people'
import styles from './style.module.css'
import PersonModal from './PersonModal'

type Props = {
	lang: 'en' | 'ja'
}

export default function FAndF({ lang }: Props) {
	const me = people.find((p) => p.isMe)
	const others = people.filter((p) => !p.isMe)

	const openModal = (person: typeof people[0]) => {
		setModal(<PersonModal person={person} lang={lang} />)
	}

	const renderRow = (person: typeof people[0], extraClass?: string) => (
		<button
			key={person.nick}
			className={`${styles.listRow} ${extraClass ?? ''}`}
			onClick={() => openModal(person)}
			aria-label={person.nick}
		>
			<div className={styles.listAvatar}>
				<img src="/icons/man.svg" alt="avatar" className={styles.avatar} />
			</div>
			<span className={styles.listNick}>{person.nick}</span>
			<div className={styles.listRoles}>
				{person.roles.map((r) => (
					<span key={r} className={styles.roleTag}>{r}</span>
				))}
			</div>
			<span className={styles.listMemoir}>{person.memoir[lang].length > 80 ? person.memoir[lang].slice(0, 80) + '...' : person.memoir[lang]}</span>
			<span className={styles.listFrom}>{(person.from ?? '—').toUpperCase()}</span>
		</button>
	)

	return (
		<section className={styles.container}>
			<div className={styles.listPanel}>
				<div className={styles.fixedTop}>
					{me && renderRow(me, styles.listRowMe)}
					<div className={styles.listHeader}>
						<span style={{paddingLeft: 10}}>NICK</span>
						<span />
						<span>RELATIONSHIP</span>
						<span>MEMOIR</span>
						<span>FROM</span>
					</div>
				</div>
				<div className={styles.listPanelInner}>
					{others.map((person) => renderRow(person))}
				</div>
			</div>
		</section>
	)
}
