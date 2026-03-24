import { Box } from '../Box'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface ToastBoxProps {
	id: string
	closeAt: Date
	closing: boolean
	height: number
	text: string
	onRemove?: (id: string) => void
}

export default function ToastBox(props: ToastBoxProps) {
	const [isAnimationComplete, setIsAnimationComplete] = useState(false)
	const [initialDelayPassed, setInitialDelayPassed] = useState(false)
	const boxRef = useRef<HTMLDivElement>(null)
	const animationRef = useRef<Animation | null>(null)

	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// function to handle the fadeout animation using Web Animations API
	const fadeOut = useCallback(() => {
		if (!boxRef.current) return

		// cancel any existing animation
		if (animationRef.current) {
			animationRef.current.cancel()
		}

		// create a new animation
		const animation = boxRef.current.animate(
			[{ opacity: 1 }, { opacity: 0 }],
			{
				duration: 5000,
				fill: 'forwards',
				easing: 'linear'
			}
		)

		// store the animation reference
		animationRef.current = animation

		// handle animation completion
		animation.onfinish = () => {
			setIsAnimationComplete(true)

			// then remove the toast after a short delay
			if (props.onRemove) {
				const onRemove = props.onRemove
				removeTimeoutRef.current = setTimeout(() => {
					onRemove(props.id)
				}, 300) // short delay after animation completes
			}
		}
	}, [props])

	useEffect(() => {
		// set initial timeout to start the closing animation
		closeTimeoutRef.current = setTimeout(() => {
			setInitialDelayPassed(true)
			fadeOut()
		}, 5000)

		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current)
			}
			if (removeTimeoutRef.current) {
				clearTimeout(removeTimeoutRef.current)
			}
			if (animationRef.current) {
				animationRef.current.cancel()
			}
		}
	}, [fadeOut])

	const handleMouseEnter = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current)
		}
		if (removeTimeoutRef.current) {
			clearTimeout(removeTimeoutRef.current)
		}
		if (animationRef.current) {
			animationRef.current.cancel()
		}
		if (boxRef.current) {
			boxRef.current.style.opacity = '1'
		}
		setIsAnimationComplete(false)
	}

	const handleMouseLeave = () => {
		// start the closing animation using JS if the initial delay has already passed
		if (initialDelayPassed) {
			fadeOut()
		} else {
			// if initial delay hasn't passed yet, restart the timeout
			closeTimeoutRef.current = setTimeout(() => {
				setInitialDelayPassed(true)
				fadeOut()
			}, 5000)
		}
	}

	return (
		<Box
			ref={boxRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className="bg-b"
			style={{
				display: 'block',
				whiteSpace: 'pre-wrap',
				width: '300px',
				margin: '10px',
				pointerEvents: isAnimationComplete ? 'none' : 'auto',
				wordWrap: 'break-word'
			}}
		>
			<p style={{ margin: 0 }}>{props.text}</p>
		</Box>
	)
}
