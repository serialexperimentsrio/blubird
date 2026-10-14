'use client'

import { ModalBox } from 'ricebag'
import type { Person } from '@/data/people'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'
import Flags from './Flags'

type Props = {
	person: Person
	lang: Lang
}

export default function PersonModal({ person, lang }: Props) {
	return (
		<ModalBox icon="man.svg">
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<div className={styles.modalTitleRow}>
						<h2 className={styles.modalHandle}>{person.nick}</h2>
						<div className={styles.modalFlags}>
							<Flags from={person.from} />
						</div>
					</div>
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
