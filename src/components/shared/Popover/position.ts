export type PopoverPosition = 'above' | 'below' | 'left' | 'right'

// configuration for popover spacing and dimensions
export const POPOVER_CONFIG = {
	// minimum spacing between popover and viewport edges
	viewportPadding: 20,
	// spacing between popover and trigger element
	triggerSpacing: 5,
	// animation offset distance for smooth transitions
	animationOffset: {
		small: 10,
		medium: 20
	},
	// animation properties
	animation: {
		duration: 300,
		fill: 'forwards' as const,
		easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
	}
}

// transform strings for different positions
export const TRANSFORMS = {
	above: 'translateX(-50%) translateY(-100%)',
	below: 'translateX(-50%)',
	left: 'translateX(-100%) translateY(-50%)',
	right: 'translateY(-50%)'
} as const

// helper function to check if element is inside a fixed-positioned container
export const isInsideFixedContainer = (element: Element): boolean => {
	let current = element.parentElement
	while (current && current !== document.body) {
		const style = window.getComputedStyle(current)
		if (style.position === 'fixed') {
			return true
		}
		current = current.parentElement
	}
	return false
}

// helper function to create position styles
export const createPositionStyle = (
	position: PopoverPosition,
	rect: DOMRect,
	spacing: number,
	padding: number,
	scrollTop: number,
	scrollLeft: number,
	useFixed: boolean = false,
	popoverSize?: { width: number; height: number }
) => {
	const base = {
		position: useFixed ? ('fixed' as const) : ('absolute' as const),
		zIndex: 9999,
		visibility: 'visible' as const,
		opacity: 1,
		contain: 'layout' as const
	}

	const maxWidth = `calc(100vw - ${padding * 2}px)`
	const minWidth = rect.width > 0 ? `${rect.width}px` : 'auto'
	const minHeight = rect.height > 0 ? `${rect.height}px` : 'auto'

	// when using fixed positioning, don't add scroll offsets as getBoundingClientRect already gives viewport coordinates
	const x = useFixed ? rect.left : rect.left + scrollLeft
	const y = useFixed ? rect.top : rect.top + scrollTop

	// use actual popover size if available for clamping calculations
	const width = popoverSize?.width || 200

	// for fixed positioning, use viewport-relative calculations
	// for absolute positioning, include scroll offset in calculations
	const scrollOffsetX = useFixed ? 0 : scrollLeft

	const positions = {
		above: {
			...base,
			// center horizontally but clamp to viewport edges (X-axis only)
			// the transform will shift by -50%, so account for that in the calculation
			left: `clamp(${padding + width / 2}px, ${x + rect.width / 2}px, calc(100vw - ${padding}px - ${width / 2}px + ${scrollOffsetX}px))`,
			// position above: no Y-axis clamping, allow scrolling
			top: `${y - spacing}px`,
			transform: TRANSFORMS.above,
			minWidth,
			maxWidth
		},
		below: {
			...base,
			// center horizontally but clamp to viewport edges (X-axis only)
			left: `clamp(${padding + width / 2}px, ${x + rect.width / 2}px, calc(100vw - ${padding}px - ${width / 2}px + ${scrollOffsetX}px))`,
			// position below: no Y-axis clamping, allow scrolling
			top: `${y + rect.height + spacing}px`,
			transform: TRANSFORMS.below,
			minWidth,
			maxWidth
		},
		left: {
			...base,
			// position to the left with X-axis clamping
			left: `max(${padding + width}px, ${x - spacing}px)`,
			// center vertically: no Y-axis clamping, allow scrolling
			top: `${y + rect.height / 2}px`,
			transform: TRANSFORMS.left,
			maxWidth,
			minHeight
		},
		right: {
			...base,
			// position to the right with X-axis clamping to viewport right edge
			left: `min(${x + rect.width + spacing}px, calc(100vw - ${padding}px - ${width}px + ${scrollOffsetX}px))`,
			// center vertically: no Y-axis clamping, allow scrolling
			top: `${y + rect.height / 2}px`,
			transform: TRANSFORMS.right,
			maxWidth,
			minHeight
		}
	}

	return positions[position] || positions.below
}

// calculate available space around trigger
export const getAvailableSpace = (triggerRect: DOMRect, padding: number) => ({
	above: triggerRect.top - padding,
	below:
		window.innerHeight - (triggerRect.top + triggerRect.height) - padding,
	left: triggerRect.left - padding,
	right: window.innerWidth - (triggerRect.left + triggerRect.width) - padding
})

// check if popover fits in given position
export const checkPositionFit = (
	position: PopoverPosition,
	triggerRect: DOMRect,
	size: { width: number; height: number },
	padding: number,
	scrollTop: number,
	useFixed: boolean
): boolean => {
	const space = getAvailableSpace(triggerRect, padding)
	const { triggerSpacing } = POPOVER_CONFIG

	if (position === 'above' || position === 'below') {
		const spaceNeeded = size.height + triggerSpacing
		const hasVerticalSpace = space[position] >= spaceNeeded

		// check horizontal centering
		const centerX = triggerRect.left + triggerRect.width / 2
		const leftEdge = centerX - size.width / 2
		const rightEdge = centerX + size.width / 2
		const hasHorizontalSpace =
			leftEdge >= padding && rightEdge <= window.innerWidth - padding

		return hasVerticalSpace && hasHorizontalSpace
	} else {
		const spaceNeeded = size.width + triggerSpacing
		const hasHorizontalSpace = space[position] >= spaceNeeded

		// check vertical centering
		const centerY = triggerRect.top + triggerRect.height / 2
		const topEdge = centerY - size.height / 2
		const bottomEdge = centerY + size.height / 2

		if (useFixed) {
			const hasVerticalSpace =
				topEdge >= padding && bottomEdge <= window.innerHeight - padding
			return hasHorizontalSpace && hasVerticalSpace
		} else {
			const hasVerticalSpace = topEdge >= scrollTop + padding
			return hasHorizontalSpace && hasVerticalSpace
		}
	}
}

export const determinePosition = (
	triggerRect: DOMRect,
	size: { width: number; height: number } | null,
	scrollTop: number,
	_scrollLeft: number,
	useFixed: boolean,
	above?: boolean,
	below?: boolean,
	left?: boolean,
	right?: boolean,
	smartPositions?: PopoverPosition[]
): PopoverPosition => {
	// explicit direction props take precedence
	if (right) return 'right'
	if (left) return 'left'
	if (below) return 'below'
	if (above) return 'above'

	// smart positioning requires size data
	if (!size) return 'below'

	const { viewportPadding: padding, triggerSpacing: spacing } = POPOVER_CONFIG

	// calculate actual position styles for each possible position to test which fits best
	const testPositions: PopoverPosition[] = smartPositions || [
		'below',
		'above',
		'right',
		'left'
	]
	const positionScores: Array<{
		position: PopoverPosition
		score: number
		fits: boolean
	}> = []

	for (const position of testPositions) {
		const fits = checkPositionFit(
			position,
			triggerRect,
			size,
			padding,
			scrollTop,
			useFixed
		)

		// calculate a score based on preference and fit quality
		let score = 0

		// position preference (below > above > right > left)
		if (position === 'below') score += 1000
		else if (position === 'above') score += 900
		else if (position === 'right') score += 800
		else if (position === 'left') score += 700

		// bonus for fitting completely
		if (fits) score += 500

		// bonus for good space utilization
		const space = getAvailableSpace(triggerRect, padding)
		const availableSpace = space[position]
		const sizeNeeded =
			position === 'below' || position === 'above'
				? size.height + spacing
				: size.width + spacing
		const utilization = Math.min(1, sizeNeeded / availableSpace)
		score += utilization * 100

		positionScores.push({ position, score, fits })
	}

	// prefer positions that fit, then by score
	positionScores.sort((a, b) => {
		if (a.fits && !b.fits) return -1
		if (!a.fits && b.fits) return 1
		return b.score - a.score
	})

	return positionScores[0]?.position || 'below'
}
