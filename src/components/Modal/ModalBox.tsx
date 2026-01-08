/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '../Box'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { isModalTransitioning, registerCloseAnimation } from './'
import { ANIMATION_CONFIG } from './animationConfig'
import style from './ModalBox.module.css'

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
	const [gotFirstDimensions, setGotFirstDimensions] = useState(false)
	const opened = useRef(false)
	const [blurry, setBlurry] = useState(false)
	const [boxStyle, setBoxStyle] = useState<React.CSSProperties>({
		transition: 'none',
		opacity: 0
	})
	const [reallyCentered, setReallyCentered] = useState(false)

	// focus any input when modal is opened
	useEffect(() => {
		divRef.current?.querySelector('input')?.focus({
			preventScroll: true
		})
	}, [])

	// update boxStyle when dimensions are set
	useEffect(() => {
		if (gotFirstDimensions) {
			setBoxStyle({})
		}
	}, [gotFirstDimensions])

	// animation functions
	const animateOuterModal = (
		from: Keyframe,
		to: Keyframe,
		duration?: number
	) => {
		if (!divRef.current) return
		const outerModal = divRef.current.parentElement
		outerModal?.animate([from, to], {
			duration: duration ?? ANIMATION_CONFIG.modalTransition.duration,
			easing: ANIMATION_CONFIG.modalTransition.easing,
			fill: 'forwards'
		})
	}

	// move these functions outside the useEffect to avoid closure issues
	// get current modal dimensions
	const getCurrentInnerModalSize = () => {
		if (!divRef.current) return
		const rect = divRef.current.getBoundingClientRect()
		return [rect.width, rect.height]
	}

	const initialStyles = () => {
		// check if document has 'light' class for theme detection
		const theme = document.documentElement.classList.contains('light')
			? 'light'
			: 'dark'

		return {
			width: `${(getCurrentInnerModalSize() || [0, 0])[0] + 100}px`,
			height: 0,
			padding: 0,
			borderColor: 'transparent',
			boxShadow: '0 0 0 0 transparent',
			filter: ANIMATION_CONFIG.modalTransition.initialFilters[theme]
		}
	}

	const finalStyles = () => {
		const modalSize = getCurrentInnerModalSize() || [0, 0]
		return {
			width: `${modalSize[0]}px`,
			height: `${modalSize[1]}px`,
			filter: 'none' // explicitly set to none for the final state
		}
	}

	useEffect(() => {
		if (!divRef.current) return

		// handle modal opening and closing
		const openModal = () => {
			// if we're transitioning between modals, make sure we start from scratch
			if (isModalTransitioning()) {
				// reset any ongoing animations
				if (divRef.current?.parentElement) {
					const outerModal = divRef.current.parentElement
					outerModal.getAnimations().forEach((anim) => anim.cancel())
				}
			}

			const fin = finalStyles()

			// start the open animation from initial state
			animateOuterModal(initialStyles(), fin)

			if (
				Number(fin.height.replace('px', '')) >
				window.innerHeight * 0.7
			) {
				setReallyCentered(true)
			}
		}

		const closeModal = (isNested = false) => {
			if (!divRef.current?.parentElement) return

			const outerModal = divRef.current.parentElement
			// cancel any existing animations
			outerModal.getAnimations().forEach((anim) => anim.cancel())

			if (isNested) {
				// for nested transitions: start the normal close animation
				// but it will be cancelled after nestedTransition.duration by the parent
				outerModal.animate([finalStyles(), initialStyles()], {
					duration: ANIMATION_CONFIG.modalTransition.duration,
					easing: ANIMATION_CONFIG.modalTransition.easing,
					fill: 'forwards'
				})
			} else {
				// normal close: play full animation
				outerModal.animate([finalStyles(), initialStyles()], {
					duration: ANIMATION_CONFIG.modalTransition.duration,
					easing: ANIMATION_CONFIG.modalTransition.easing,
					fill: 'forwards'
				})
			}
		}

		// register close animation with provider
		registerCloseAnimation((isNested?: boolean) => {
			// close animation, will be interrupted if a new modal opens
			closeModal(isNested)

			// we don't need the timeout check anymore since
			// the parent component now handles transitions better
		})

		// handle resize events
		const resizeObserver = new ResizeObserver(() => {
			if (!opened.current) {
				openModal()
				opened.current = true
			} else {
				animateOuterModal({}, finalStyles())

				// check if modal should be really centered when content size changes
				if (divRef.current) {
					const rect = divRef.current.getBoundingClientRect()
					setReallyCentered(rect.height > window.innerHeight * 0.7)
				}
			}
		})

		resizeObserver.observe(divRef.current)
		setGotFirstDimensions(true)

		// handle blurry pixels on odd-width screens and check if modal should be really centered
		const updateOnResize = () => {
			setBlurry(window.innerWidth % 2 !== 0)

			// check if modal should be really centered on resize
			if (divRef.current) {
				const rect = divRef.current.getBoundingClientRect()
				setReallyCentered(rect.height > window.innerHeight * 0.7)
			}
		}
		window.addEventListener('resize', updateOnResize)
		updateOnResize()

		// Store reference for cleanup to avoid stale closure issues
		const currentRef = divRef.current
		return () => {
			if (currentRef) resizeObserver.unobserve(currentRef)
			window.removeEventListener('resize', updateOnResize)
		}
	}, [])

	useEffect(() => {
		animateOuterModal(
			{},
			{
				top: reallyCentered ? '50%' : '40%'
			}
		)
		// finalStyles and initialStyles are intentionally not dependencies
		// they're created in the main effect and don't change during component lifecycle
	}, [reallyCentered])

	// generate a unique key that always forces a remount
	// key is based on mount time + random value to ensure uniqueness
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
			className={`outerModal ${gotFirstDimensions ? style.outerModal : ''}`}
			style={{
				...boxStyle,
				marginLeft: blurry ? 0 : 0.5
			}}
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
