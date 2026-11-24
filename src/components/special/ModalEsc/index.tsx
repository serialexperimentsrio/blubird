'use client'

import { hideModal } from 'paiger'
import { useEffect, useRef, useState } from 'react'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'

type Corner = { top: number; left: number }

// The floating ESC button from VNDialog, for a paiger ModalBox. Render it next to
// the ModalBox (with closeButton={false}), not inside: the box clips anything
// outside itself for its open animation. So this sits beside it and follows the
// box's top-right corner instead.
export default function ModalEsc({ lang }: { lang: Lang }) {
	const ref = useRef<HTMLButtonElement>(null)
	const [corner, setCorner] = useState<Corner | null>(null)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const button = ref.current
		const box = button?.parentElement?.querySelector<HTMLElement>('.pg-modal')
		const content = box?.querySelector<HTMLElement>('.pg-modal-content')
		if (!button || !box || !content) return

		const update = () => {
			const b = box.getBoundingClientRect()
			const c = content.getBoundingClientRect()
			// Only while the box is fully open, so the button doesn't hang in the
			// air while the box unfolds or folds shut
			const isOpen = b.height > 0 && b.height >= c.height - 1
			setOpen(isOpen)
			// Keep it on screen when the box reaches the top of a short window
			if (isOpen) setCorner({ top: Math.max(c.top, button.offsetHeight + 20), left: c.right })
		}

		const observer = new ResizeObserver(update)
		observer.observe(box)
		observer.observe(content)
		window.addEventListener('resize', update)
		return () => {
			observer.disconnect()
			window.removeEventListener('resize', update)
		}
	}, [])

	return (
		<button
			ref={ref}
			type="button"
			// Gives focus a place inside the dialog when the box has no controls;
			// the ModalBox still moves it to its first link when it has one
			autoFocus
			className={`${styles.esc} ${open ? styles.open : ''}`}
			style={corner ?? undefined}
			aria-label={lang === 'ja' ? '閉じる' : 'Close'}
			onClick={hideModal}
		>
			ESC
		</button>
	)
}
