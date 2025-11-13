import { Box } from '../Box'
import React, { useEffect, useId, useRef, useState } from 'react'
import style from './style.module.css'
import {
	type PopoverPosition,
	POPOVER_CONFIG,
	createPositionStyle,
	determinePosition,
	isInsideFixedContainer
} from './position'
import { setupObservers } from './observers'
import { createAnimationKeyframes, measurePopoverSize } from './animation'

function PopoverContent({
	open,
	children,
	position,
	popoverRef,
	onAnimationComplete,
	contentRef,
	openSizeRef,
	isMeasuring
}: {
	open: boolean
	children: React.ReactNode
	position: PopoverPosition
	popoverRef: React.RefObject<HTMLDivElement | null>
	onAnimationComplete?: () => void
	contentRef?: React.RefObject<HTMLDivElement | null>
	openSizeRef: React.RefObject<{ width: number; height: number } | null>
	isMeasuring: boolean
}) {
	const internalContentRef = useRef<HTMLDivElement>(null)
	const actualContentRef = contentRef || internalContentRef
	const animationRef = useRef<Animation | null>(null)
	const previousOpenRef = useRef<boolean>(open)

	// handle animations
	useEffect(() => {
		// skip if state hasn't actually changed or if we're measuring
		if (previousOpenRef.current === open || isMeasuring) {
			return
		}
		previousOpenRef.current = open

		if (!popoverRef.current || !actualContentRef.current) {
			return
		}

		// cancel any existing animation
		if (animationRef.current) {
			animationRef.current.cancel()
			animationRef.current = null
		}

		let currentSize = { width: 0, height: 0 }

		if (open) {
			// opening animation - use pre-measured size from parent
			currentSize = openSizeRef.current || { width: 0, height: 0 }

			// setup for height animation
			popoverRef.current.style.width = 'auto'
			popoverRef.current.style.height = '0px'
			popoverRef.current.style.overflow = 'hidden'

			// create opening animation keyframes
			const offset = POPOVER_CONFIG.animationOffset.medium
			const keyframes = createAnimationKeyframes(
				position,
				currentSize.height,
				offset,
				true
			)

			animationRef.current = popoverRef.current.animate(
				keyframes,
				POPOVER_CONFIG.animation
			)

			// reset height to auto and allow overflow after opening animation completes
			animationRef.current.addEventListener('finish', () => {
				if (popoverRef.current && open) {
					// cancel animation to remove fill:forwards effect, then set styles
					animationRef.current?.cancel()
					popoverRef.current.style.height = 'auto'
					popoverRef.current.style.overflow = 'visible'
				}
			})
		} else {
			// closing animation - use stored size from opening
			currentSize = openSizeRef.current || { width: 0, height: 0 }

			// create closing animation keyframes
			const offset = POPOVER_CONFIG.animationOffset.small
			const keyframes = createAnimationKeyframes(
				position,
				currentSize.height,
				offset,
				false
			)

			animationRef.current = popoverRef.current.animate(
				keyframes,
				POPOVER_CONFIG.animation
			)

			animationRef.current.addEventListener('finish', () => {
				if (onAnimationComplete) {
					onAnimationComplete()
				}
			})
		}
		// Refs (popoverRef, actualContentRef, openSizeRef) are intentionally not in dependencies
		// as they don't change and this effect should only run when open/position/isMeasuring changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, position, onAnimationComplete, isMeasuring])

	// cleanup animation on unmount
	useEffect(() => {
		return () => {
			if (animationRef.current) {
				animationRef.current.cancel()
			}
		}
	}, [])

	return (
		<div ref={actualContentRef} className={style.popoverContent}>
			{children}
		</div>
	)
}

export default function WithPopover({
	children,
	content,
	above,
	below,
	left,
	right,
	smartPositions,
	defaultOpen = false,
	noCloseOnClickOutside = false,
	style: customStyle
}: {
	children?: React.ReactElement
	content: React.ReactNode | ((closePopover: () => void) => React.ReactNode)
	above?: boolean
	below?: boolean
	left?: boolean
	right?: boolean
	smartPositions?: PopoverPosition[]
	defaultOpen?: boolean
	noCloseOnClickOutside?: boolean
	style?: React.CSSProperties
}) {
	// validate that only one direction prop is set
	useEffect(() => {
		const directionProps = [above, below, left, right].filter(Boolean)
		if (directionProps.length > 1) {
			console.warn(
				'WithPopover: Multiple direction props detected. Only one of "above", "below", "left", or "right" should be set. ' +
					'Precedence: right > left > below > above'
			)
		}
	}, [above, below, left, right])

	const [isOpen, setIsOpen] = useState(false)
	const [isVisible, setIsVisible] = useState(false) // tracks if popover is shown
	const [isMeasuring, setIsMeasuring] = useState(false) // tracks if we're in measurement phase
	const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({})
	const [currentPosition, setCurrentPosition] =
		useState<PopoverPosition>('below')
	const childrenRef = useRef<HTMLSpanElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)
	const popoverContentRef = useRef<HTMLDivElement>(null)
	const openSizeRef = useRef<{ width: number; height: number } | null>(null)
	const baseId = useId()
	const popoverId = `popover-${baseId}`

	const measureSize = () =>
		popoverRef.current ? measurePopoverSize(popoverRef.current) : null

	const calculatePosition = (
		size: { width: number; height: number } | null
	) => {
		if (!childrenRef.current) return {}
		const rect = childrenRef.current.getBoundingClientRect()
		if (
			rect.width === 0 &&
			rect.height === 0 &&
			rect.top === 0 &&
			rect.left === 0
		)
			return {}

		const isFixed = isInsideFixedContainer(childrenRef.current)
		const scrollTop = isFixed
			? 0
			: window.pageYOffset || document.documentElement.scrollTop
		const scrollLeft = isFixed
			? 0
			: window.pageXOffset || document.documentElement.scrollLeft

		const position = determinePosition(
			rect,
			size,
			scrollTop,
			scrollLeft,
			isFixed,
			above,
			below,
			left,
			right,
			smartPositions
		)
		setCurrentPosition(position)

		const { viewportPadding: padding, triggerSpacing: spacing } =
			POPOVER_CONFIG
		return createPositionStyle(
			position,
			rect,
			spacing,
			padding,
			scrollTop,
			scrollLeft,
			isFixed,
			size || undefined
		)
	}

	const openPopover = async () => {
		if (!popoverRef.current || isVisible) return

		// do all measurements invisibly off-screen to calculate final position
		let finalSize: { width: number; height: number } | null = null
		let finalPosition: React.CSSProperties = {}

		try {
			// get natural size measurement first
			const naturalSize = measureSize()
			if (!naturalSize) return

			// calculate estimated position
			const estimatedPosition = calculatePosition(naturalSize)
			if (Object.keys(estimatedPosition).length === 0) return

			// now measure with position constraints to get accurate final size
			setIsMeasuring(true)
			setIsVisible(true)

			// apply hidden styles BEFORE showing popover to prevent flicker
			Object.assign(popoverRef.current.style, {
				...(estimatedPosition as React.CSSProperties),
				width: 'auto',
				height: 'auto',
				overflow: 'visible',
				visibility: 'hidden !important',
				opacity: '0 !important',
				contain: 'layout style',
				animation: 'none !important',
				transition: 'none !important'
			})

			// now show the popover (it will be invisible due to styles above)
			popoverRef.current.showPopover()

			// measure constrained size
			await new Promise((resolve) => requestAnimationFrame(resolve))
			const constrainedRect = popoverRef.current.getBoundingClientRect()
			finalSize =
				constrainedRect.width > 0 && constrainedRect.height > 0
					? {
							width: constrainedRect.width,
							height: constrainedRect.height
						}
					: naturalSize

			// calculate final position with accurate size
			finalPosition = calculatePosition(finalSize)
			if (Object.keys(finalPosition).length === 0) {
				finalPosition = estimatedPosition
			}

			// always apply final position before hiding to ensure consistency
			Object.assign(popoverRef.current.style, {
				...(finalPosition as React.CSSProperties),
				visibility: 'hidden !important',
				opacity: '0 !important',
				contain: 'layout style',
				animation: 'none !important',
				transition: 'none !important'
			})

			// hide popover to prepare for animation
			popoverRef.current.hidePopover()
		} catch {
			// fallback if measurement fails
			finalSize = measureSize()
			finalPosition = calculatePosition(finalSize)
		}

		// store final measurements
		openSizeRef.current = finalSize
		setIsOpen(false)
		setIsVisible(false)
		setIsMeasuring(false)

		// start animation with final position (no position changes)
		await new Promise((resolve) => requestAnimationFrame(resolve))

		// apply final position with initial animation state BEFORE showing
		Object.assign(popoverRef.current.style, {
			...(finalPosition as React.CSSProperties),
			height: '0px',
			opacity: '0',
			overflow: 'hidden',
			animation: 'none !important',
			transition: 'none !important'
		})

		setIsVisible(true)
		setIsOpen(true)
		popoverRef.current.showPopover()
		setPositionStyle(finalPosition)
	}

	const closePopover = () => {
		if (!isVisible) return
		setIsOpen(false)
	}

	const handleCloseAnimationComplete = () => {
		if (popoverRef.current) {
			popoverRef.current.hidePopover()
		}
		setIsVisible(false)
		setPositionStyle({})
	}

	const togglePopover = () => {
		if (isVisible) {
			closePopover()
		} else {
			void openPopover()
		}
	}

	// handle target element resize/position changes
	useEffect(() => {
		if (!isVisible || !childrenRef.current || !popoverRef.current) return

		const updatePosition = () => {
			if (!popoverRef.current || !childrenRef.current) return

			// remove size constraints and get current size
			const resetStyles =
				'width: auto; height: auto; minWidth: auto; minHeight: auto; maxWidth: none; maxHeight: none; overflow: visible;'
			popoverRef.current.style.cssText += resetStyles
			void popoverRef.current.offsetHeight

			const rect = popoverRef.current.getBoundingClientRect()
			const size =
				rect.width > 0 && rect.height > 0
					? { width: rect.width, height: rect.height }
					: null
			if (!size) return

			const triggerRect = childrenRef.current.getBoundingClientRect()
			const isFixed = isInsideFixedContainer(childrenRef.current)
			let scrollTop = 0,
				scrollLeft = 0

			if (!isFixed) {
				scrollTop =
					window.pageYOffset || document.documentElement.scrollTop
				scrollLeft =
					window.pageXOffset || document.documentElement.scrollLeft
			}

			const { viewportPadding: padding, triggerSpacing: spacing } =
				POPOVER_CONFIG

			// during resize/reposition, keep the same position direction but update coordinates
			// smart positioning only runs once during initial opening
			const positionStyle = createPositionStyle(
				currentPosition,
				triggerRect,
				spacing,
				padding,
				scrollTop,
				scrollLeft,
				isFixed,
				size
			)
			setPositionStyle(positionStyle)

			popoverRef.current.style.height = 'auto'
			popoverRef.current.style.overflow = 'visible'
		}

		return setupObservers(
			childrenRef.current,
			popoverContentRef.current,
			updatePosition
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible])

	// handle click outside
	useEffect(() => {
		if (!isVisible || noCloseOnClickOutside) return

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			const outsidePopover =
				popoverRef.current && !popoverRef.current.contains(target)
			const outsideTrigger =
				childrenRef.current && !childrenRef.current.contains(target)
			if (outsidePopover && outsideTrigger) closePopover()
		}

		const timer = setTimeout(
			() => document.addEventListener('mousedown', handleClickOutside),
			0
		)
		return () => {
			clearTimeout(timer)
			document.removeEventListener('mousedown', handleClickOutside)
		}
		// closePopover is intentionally not in dependencies - it's a stable function
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible, noCloseOnClickOutside])

	// handle default open
	useEffect(() => {
		if (defaultOpen && !isVisible && childrenRef.current) {
			const frameId = requestAnimationFrame(openPopover)
			return () => cancelAnimationFrame(frameId)
		}
		// This effect intentionally only runs once on mount - defaultOpen, isVisible, openPopover, childrenRef should not be dependencies
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const contentElement =
		typeof content === 'function' ? content(closePopover) : content
	const triggerElement = children
		? React.cloneElement(
				children as React.ReactElement<{
					onClick?: (e: React.MouseEvent) => void
					ref?: React.Ref<HTMLSpanElement>
				}>,
				{
					ref: childrenRef,
					onClick: (e: React.MouseEvent) => {
						const originalOnClick = (
							children as React.ReactElement<{
								onClick?: (e: React.MouseEvent) => void
							}>
						).props.onClick
						originalOnClick?.(e)
						togglePopover()
					}
				}
			)
		: null

	return (
		<>
			{triggerElement}
			<Box
				ref={popoverRef}
				popover="manual"
				id={popoverId}
				className={style.popover}
				style={{ ...positionStyle, ...customStyle } as React.CSSProperties}
			>
				<PopoverContent
					position={currentPosition}
					open={isOpen}
					popoverRef={popoverRef}
					contentRef={popoverContentRef}
					openSizeRef={openSizeRef}
					isMeasuring={isMeasuring}
					onAnimationComplete={
						!isOpen ? handleCloseAnimationComplete : undefined
					}
				>
					{contentElement}
				</PopoverContent>
			</Box>
		</>
	)
}
