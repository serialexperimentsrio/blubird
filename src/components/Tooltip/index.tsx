import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// define types for mouse events we care about
type MouseEventHandler = (event: React.MouseEvent) => void

// define props for child elements
type ChildProps = {
	onMouseEnter?: MouseEventHandler
	onMouseLeave?: MouseEventHandler
	onMouseDown?: MouseEventHandler
	[key: string]: unknown // use unknown instead of any
}

type TooltipProps = {
	text: string
	children: React.ReactElement<ChildProps>
	above?: boolean
	left?: boolean
	right?: boolean
}

export default function WithTooltip({
	text,
	children,
	above,
	left,
	right
}: TooltipProps) {
	// validate that only one direction prop is set
	useEffect(() => {
		const directionProps = [above, left, right].filter(Boolean)
		if (directionProps.length > 1) {
			console.warn(
				'WithTooltip: Multiple direction props detected. Only one of "above", "left", or "right" should be set. ' +
					'Precedence: right > left > above > default(below)'
			)
		}
	}, [above, left, right])

	// state
	const [hovered, setHovered] = useState(false)
	const [visible, setVisible] = useState(false)

	// refs
	const childRef = useRef<HTMLElement>(null)
	const boxRef = useRef<HTMLDivElement>(null)
	const tooltipSize = useRef({ width: 0, height: 0 })

	// handle initial tooltip setup as soon as component mounts
	useEffect(() => {
		// this will prepare the tooltip before first hover
		// so that the animation works immediately
		setVisible(true)
		setTimeout(() => {
			setVisible(false)
		}, 0)
	}, [])

	// reset tooltip size cache when text changes
	useEffect(() => {
		tooltipSize.current = { width: 0, height: 0 }
	}, [text])

	// main effect for handling animations & scroll positioning
	useEffect(() => {
		// always run this effect when hover changes
		// prepare for animation if hovered
		if (hovered) {
			setVisible(true)
		}

		// don't continue if no refs available
		if (!childRef.current || !boxRef.current) return

		// get current child position
		const childRect = childRef.current.getBoundingClientRect()

		// set up tooltip size if needed
		if (tooltipSize.current.width === 0 && boxRef.current) {
			const tooltip = boxRef.current.querySelector(
				'div'
			) as HTMLDivElement
			if (tooltip) {
				const boxRect = tooltip.getBoundingClientRect()
				tooltipSize.current = {
					width: Math.round(boxRect.width + 4),
					height: Math.round(boxRect.height + 4)
				}
			}
		}

		boxRef.current.style.position = 'absolute'

		// set up animation keyframes
		const keyframes = [
			{
				opacity: 0,
				top: `${Math.round(
					childRect.top + childRect.height + window.scrollY - 10
				)}px`,
				left: `${Math.round(
					childRect.left + window.scrollX + childRect.width / 2
				)}px`,
				width: 0,
				height: 0
			},
			{
				opacity: 1,
				top: `${Math.round(
					childRect.top + childRect.height + 5 + window.scrollY
				)}px`,
				left: `min(${Math.round(
					childRect.left +
						childRect.width / 2 -
						tooltipSize.current.width / 2 +
						window.scrollX
				)}px, ${Math.round(
					window.innerWidth - tooltipSize.current.width - 20
				)}px)`,
				width: `${tooltipSize.current.width}px`,
				height: `${tooltipSize.current.height}px`
			}
		]

		// handle above positioning
		if (above) {
			keyframes[0].top = `${Math.round(childRect.top + window.scrollY + 10)}px`
			keyframes[1].top = `${Math.round(childRect.top - 40 + window.scrollY)}px`
		}

		// handle left positioning
		if (left) {
			keyframes[0].top = `${Math.round(
				childRect.top + childRect.height / 2 + window.scrollY
			)}px`
			keyframes[0].left = `${Math.round(
				childRect.left + window.scrollX + 10
			)}px`
			keyframes[1].top = `${Math.round(
				childRect.top +
					childRect.height / 2 -
					tooltipSize.current.height / 2 +
					window.scrollY
			)}px`
			keyframes[1].left = `${Math.max(
				5,
				Math.round(
					childRect.left -
						tooltipSize.current.width -
						5 +
						window.scrollX
				)
			)}px`
		}

		// handle right positioning
		if (right) {
			keyframes[0].top = `${Math.round(
				childRect.top + childRect.height / 2 + window.scrollY
			)}px`
			keyframes[0].left = `${Math.round(
				childRect.left + childRect.width + window.scrollX - 10
			)}px`
			keyframes[1].top = `${Math.round(
				childRect.top +
					childRect.height / 2 -
					tooltipSize.current.height / 2 +
					window.scrollY
			)}px`
			keyframes[1].left = `${Math.min(
				window.innerWidth - tooltipSize.current.width - 5,
				Math.round(
					childRect.left + childRect.width + 5 + window.scrollX
				)
			)}px`
		}

		// reverse animation when hiding
		if (!hovered) keyframes.reverse()

		// animate the tooltip with appropriate timing
		const animation = boxRef.current.animate(
			keyframes,
			hovered
				? {
						duration: 200,
						easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
						fill: 'forwards'
					}
				: {
						duration: 400,
						easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
						fill: 'forwards'
					}
		)

		// handle hide animation complete
		if (!hovered) {
			animation.onfinish = () => setVisible(false)
		}

		// handle scroll updates
		const updateOnScroll = () => {
			if (!childRef.current || !boxRef.current) return

			// force animation to rerun with new position
			animation.cancel()

			// trigger a new render cycle with fresh positions
			setVisible((v) => !v)
			setTimeout(() => setVisible((v) => !v), 0)
		}

		// only add scroll listener when hovered
		if (hovered) {
			window.addEventListener('scroll', updateOnScroll, { passive: true })
		}

		return () => {
			// clean up animations and scroll listeners
			animation.cancel()
			window.removeEventListener('scroll', updateOnScroll)
		}
	}, [hovered, above, left, right])

	// show tooltip content
	const tooltipContent =
		(hovered || visible) &&
		createPortal(
			<div
				ref={boxRef}
				style={{
					pointerEvents: 'none',
					overflow: 'hidden',
					position: 'fixed',
					display: 'inline-block',
					border: '2px solid var(--blue-accent)',
					backgroundColor: 'var(--blue)',
					color: 'var(--white)',
					boxShadow: '0 4px 12px color-mix(in srgb, var(--blue) 30%, transparent)',
					zIndex: 99999999,
					// animation will handle these properties:
					opacity: 1,
					width: 0,
					height: 0
				}}
			>
				<div
					style={{
							whiteSpace: 'nowrap',
						padding: '4px 8px',
						boxSizing: 'content-box',
						width: 'auto',
						transform:
							left || right
								? 'translateY(-50%)'
								: 'translateX(-50%)',
						left: left || right ? '0' : '50%',
						top: left || right ? '50%' : '0',
						position: 'absolute'
					}}
				>
					{text}
				</div>
			</div>,
			document.body
		)

	// safely clone child element with added props
	const clone = React.cloneElement(children, {
		...children.props,

		// merge refs
		ref: (node: HTMLElement | null) => {
			// update our ref
			childRef.current = node

			// typescript don't let us access ref directly from ReactElement
			// so we gotta be tricky - cast to unknown first then to RefObject
			type RefType =
				| ((instance: HTMLElement | null) => void)
				| { current: HTMLElement | null }
				| null
			const originalRef = React.isValidElement(children)
				? (children as unknown as { ref?: RefType }).ref
				: null
			if (!originalRef) return

			// handle both function and object refs
			if (typeof originalRef === 'function') {
				// function ref
				;(originalRef as (instance: HTMLElement | null) => void)(node)
			} else if (
				originalRef &&
				typeof originalRef === 'object' &&
				'current' in originalRef
			) {
				// ref object - forward the ref
				// eslint-disable-next-line react-hooks/immutability
				;(originalRef as { current: HTMLElement | null }).current = node
			}
		},

		// add mouse handlers
		onMouseEnter: (e: React.MouseEvent) => {
			setHovered(true)

			// call original
			if (children.props.onMouseEnter) {
				children.props.onMouseEnter(e)
			}
		},

		onMouseLeave: (e: React.MouseEvent) => {
			setHovered(false)

			if (children.props.onMouseLeave) {
				children.props.onMouseLeave(e)
			}
		},

		onMouseDown: (e: React.MouseEvent) => {
			setHovered(false)

			if (children.props.onMouseDown) {
				children.props.onMouseDown(e)
			}
		}
	})

	return (
		<>
			{tooltipContent}
			{clone}
		</>
	)
}
