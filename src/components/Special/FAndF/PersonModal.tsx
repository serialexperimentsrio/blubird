'use client'

import ModalBox from '@/components/Modal/ModalBox'
import type { Person } from '@/data/people'
import styles from './style.module.css'

type Props = {
	person: Person
	lang: 'en' | 'ja'
}

export default function PersonModal({ person, lang }: Props) {
	return (
		<ModalBox icon="man.svg">
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalHandle}>{person.nick}</h2>
					<div className={styles.modalRoles}>
						{person.roles.map((role) => (
							<span key={role} className={styles.roleTag}>#{role}</span>
						))}
					</div>
				</div>
				<p className={styles.modalMemoir}>{person.memoir[lang]}</p>
				{person.notes[lang].length > 0 && (
					<ul className={styles.modalNotes}>
						{person.notes[lang].map((note, i) => (
							<li key={i}>{note}</li>
						))}
					</ul>
				)}
			</div>
		</ModalBox>
	)
}
