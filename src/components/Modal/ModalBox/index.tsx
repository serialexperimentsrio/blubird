/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '../../Box'
import type React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { isModalTransitioning, registerCloseAnimation } from '../'
import { ANIMATION_CONFIG } from '../animationConfig'
import style from './style.module.css'

// type for modal box props
export interface ModalBoxProps {
	className?: string
	style?: React.CSSProperties
	children: React.ReactNode
	icon?: string
	image?: string
}

// type for components that return a ModalBox
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
		divRef.current?.querySelector('input')?.focus({
			preventScroll: true
		})
	}, [])

	useEffect(() => {
		if (!divRef.current) return

		const animateOuterModal = (from: Keyframe, to: Keyframe) => {
			if (!divRef.current) return
			const outerModal = divRef.current.parentElement
			outerModal?.animate([from, to], {
				duration: ANIMATION_CONFIG.modalTransition.duration,
				easing: ANIMATION_CONFIG.modalTransition.easing,
				fill: 'forwards'
			})
		}

		const getCurrentInnerModalSize = () => {
			if (!divRef.current) return
			const rect = divRef.current.getBoundingClientRect()
			return [rect.width, rect.height]
		}

		const getThemeFilter = () => {
			const theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'
			return ANIMATION_CONFIG.modalTransition.initialFilters[theme]
		}

		const openInitialStyles = (width: number) => ({
			width: `${width}px`,
			height: 0,
			boxShadow: '0 0 0 0 transparent',
			filter: getThemeFilter()
		})

		const closeInitialStyles = (width: number) => ({
			width: `${width}px`,
			height: 0,
			borderWidth: 0,
			borderColor: 'transparent',
			boxShadow: '0 0 0 0 transparent',
			filter: getThemeFilter()
		})

		const finalStyles = () => {
			const modalSize = getCurrentInnerModalSize() || [0, 0]
			return {
				width: `${modalSize[0]}px`,
				height: `${modalSize[1]}px`
			}
		}

		const openModal = () => {
			if (isModalTransitioning() && divRef.current?.parentElement) {
				divRef.current.parentElement.getAnimations().forEach((anim) => anim.cancel())
			}
			const fin = finalStyles()
			const width = parseFloat(fin.width)
			animateOuterModal(openInitialStyles(width), fin)
		}

		const closeModal = (isNested = false) => {
			if (!divRef.current?.parentElement) return
			const outerModal = divRef.current.parentElement
			outerModal.getAnimations().forEach((anim) => anim.cancel())
			const duration = isNested
				? ANIMATION_CONFIG.nestedTransition.duration
				: ANIMATION_CONFIG.modalTransition.duration
			const fin = finalStyles()
			const anim = outerModal.animate([fin, closeInitialStyles(parseFloat(fin.width))], {
				duration,
				easing: ANIMATION_CONFIG.modalTransition.easing,
				fill: 'forwards'
			})
			anim.onfinish = () => {
				outerModal.style.visibility = 'hidden'
			}
		}

		registerCloseAnimation((isNested?: boolean) => {
			closeModal(isNested)
		})

		// Double rAF: first frame waits for React's DOM commit,
		// second frame waits for the browser's layout pass so
		// getBoundingClientRect() always returns real dimensions.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				openModal()
				opened.current = true
			})
		})

		const resizeObserver = new ResizeObserver(() => {
			if (opened.current) {
				animateOuterModal({}, finalStyles())
			}
		})

		resizeObserver.observe(divRef.current)

		const currentRef = divRef.current
		return () => {
			if (currentRef) resizeObserver.unobserve(currentRef)
		}
	}, [])

	// generate a unique key that always forces a remount
	const boxKey = useMemo(
		() => {
			if (typeof window === 'undefined') return 'modal-ssr'
			return `modal-${Date.now()}-${Math.random()}`
		},
		[]
	)

	return (
		<Box
			key={boxKey}
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
