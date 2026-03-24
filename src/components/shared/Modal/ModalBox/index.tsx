/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '../../Box'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { isModalTransitioning, registerCloseAnimation } from '../'
import { ANIMATION_CONFIG } from '../animationConfig'
import style from './style.module.css'

export interface ModalBoxProps {
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
	icon?: string
	image?: string
}

export type ModalBoxComponent = React.ReactElement<ModalBoxProps>

const ModalBox = ({
	className,
	style: propStyle,
	children,
	icon,
	image
}: ModalBoxProps) => {
	const divRef = useRef<HTMLDivElement>(null)
	const opened = useRef(false)

	// focus any input when modal is opened
	useEffect(() => {
		divRef.current?.querySelector('input')?.focus({ preventScroll: true })
	}, [])

	useEffect(() => {
		if (!divRef.current) return

		const animateOuterModal = (from: Keyframe, to: Keyframe) => {
			if (!divRef.current) return
			divRef.current.parentElement?.animate([from, to], {
				duration: ANIMATION_CONFIG.modalTransition.duration,
				easing: ANIMATION_CONFIG.modalTransition.easing,
				fill: 'forwards'
			})
		}

		const getThemeFilter = () => ANIMATION_CONFIG.modalTransition.initialFilters.dark

		const finalStyles = () => {
			const rect = divRef.current?.getBoundingClientRect()
			return { width: `${rect?.width ?? 0}px`, height: `${rect?.height ?? 0}px` }
		}

		const openModal = () => {
			if (isModalTransitioning() && divRef.current?.parentElement) {
				divRef.current.parentElement.getAnimations().forEach((anim) => anim.cancel())
			}
			const fin = finalStyles()
			const width = parseFloat(fin.width)
			animateOuterModal({ width: `${width}px`, height: 0, boxShadow: '0 0 0 0 transparent', filter: getThemeFilter() }, fin)
		}

		const closeModal = (isNested = false) => {
			if (!divRef.current?.parentElement) return
			const outerModal = divRef.current.parentElement
			outerModal.getAnimations().forEach((anim) => anim.cancel())
			const duration = isNested
				? ANIMATION_CONFIG.nestedTransition.duration
				: ANIMATION_CONFIG.modalTransition.duration
			const fin = finalStyles()
			const width = parseFloat(fin.width)
			const anim = outerModal.animate(
				[fin, { width: `${width}px`, height: 0, filter: getThemeFilter() }],
				{ duration, easing: ANIMATION_CONFIG.modalTransition.easing, fill: 'forwards' }
			)
			anim.onfinish = () => {
				outerModal.style.visibility = 'hidden'
			}
		}

		registerCloseAnimation((isNested?: boolean) => closeModal(isNested))

		// Double rAF: first frame waits for React's DOM commit,
		// second frame waits for the browser's layout pass so
		// getBoundingClientRect() returns real dimensions.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				openModal()
				opened.current = true
			})
		})

		let resizeRafId: number | undefined
		const resizeObserver = new ResizeObserver(() => {
			if (!opened.current) return
			if (resizeRafId !== undefined) cancelAnimationFrame(resizeRafId)
			resizeRafId = requestAnimationFrame(() => {
				resizeRafId = undefined
				animateOuterModal({}, finalStyles())
			})
		})

		resizeObserver.observe(divRef.current)

		const currentRef = divRef.current
		return () => {
			if (currentRef) resizeObserver.unobserve(currentRef)
			if (resizeRafId !== undefined) cancelAnimationFrame(resizeRafId)
		}
	}, [])

	return (
		<Box
			image={image}
			icon={icon}
			className={`outerModal ${style.outerModal}`}
		>
			<div
				ref={divRef}
				className={className}
				style={{ padding: 20, ...propStyle }}
			>
				{children}
			</div>
		</Box>
	)
}

export default ModalBox
