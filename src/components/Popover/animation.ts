import type { PopoverPosition } from './position'
import { TRANSFORMS } from './position'

// helper function for creating animation keyframes
export const createAnimationKeyframes = (
	position: PopoverPosition,
	height: number,
	offset: number,
	isOpening: boolean
): Keyframe[] => {
	const baseTransform = TRANSFORMS[position]
	let offsetTransform: string = baseTransform

	// add offset based on position
	const offsets = {
		left: `translateX(${offset}px)`,
		right: `translateX(-${offset}px)`,
		above: `translateY(${offset}px)`, // slide from below upwards
		below: `translateY(-${offset}px)` // slide from above downwards
	}
	offsetTransform = `${baseTransform} ${offsets[position]}`

	// animate height for ALL positions, will be reset to auto after animation
	const startFrame = {
		height: isOpening ? '0px' : `${height}px`,
		opacity: isOpening ? 0 : 1,
		overflow: 'hidden' as const,
		transform: isOpening ? offsetTransform : baseTransform
	}
	const endFrame = {
		height: isOpening ? `${height}px` : '0px',
		opacity: isOpening ? 1 : 0,
		overflow: 'hidden' as const,
		transform: isOpening ? baseTransform : offsetTransform
	}
	return [startFrame, endFrame]
}

// measure popover natural size while accounting for viewport constraints
export const measurePopoverSize = (
	element: HTMLDivElement
): { width: number; height: number } | null => {
	try {
		// cancel any existing animations to avoid interference
		element.getAnimations().forEach((anim) => anim.cancel())

		// store original styles
		const original = element.style.cssText

		// apply measurement styles in a single batch, keep on-screen for accurate constraint calculation
		element.style.cssText = [
			'opacity: 0 !important',
			'position: fixed !important',
			'top: 0 !important',
			'left: 0 !important',
			'width: auto !important',
			'height: auto !important',
			'transform: none !important',
			'contain: layout style !important',
			'visibility: hidden !important',
			'pointer-events: none !important'
		].join('; ')

		// show and measure in single frame
		element.showPopover()
		const rect = element.getBoundingClientRect()
		element.hidePopover()

		// restore original styles
		element.style.cssText = original

		return rect.width > 0 && rect.height > 0
			? { width: rect.width, height: rect.height }
			: null
	} catch {
		return null
	}
}
