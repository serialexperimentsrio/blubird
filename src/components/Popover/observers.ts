// helper function to setup observers for position tracking
export const setupObservers = (
	triggerElement: HTMLElement,
	popoverContentElement: HTMLElement | null,
	updatePosition: () => void
) => {
	// debounced update function to prevent excessive calls
	let updateTimeout: number | undefined
	const debouncedUpdate = () => {
		if (updateTimeout) clearTimeout(updateTimeout)
		updateTimeout = window.setTimeout(updatePosition, 8)
	}

	const targetResizeObserver = new ResizeObserver(debouncedUpdate)
	const popoverResizeObserver = new ResizeObserver(debouncedUpdate)

	// observe target and limited parents (max 5 levels to prevent excessive observers)
	targetResizeObserver.observe(triggerElement)
	let currentElement = triggerElement.parentElement
	let depth = 0
	while (currentElement && currentElement !== document.body && depth < 5) {
		targetResizeObserver.observe(currentElement)
		currentElement = currentElement.parentElement
		depth++
	}

	// observe popover content
	if (popoverContentElement) {
		popoverResizeObserver.observe(popoverContentElement)
	}

	// track position changes more aggressively
	let lastRect = triggerElement.getBoundingClientRect()

	// use intersection observer for viewport changes
	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				const newRect = entry.boundingClientRect
				if (
					Math.abs(lastRect.left - newRect.left) > 0.5 ||
					Math.abs(lastRect.top - newRect.top) > 0.5
				) {
					lastRect = newRect
					debouncedUpdate()
				}
			}
		},
		{ threshold: [0, 0.1, 0.5, 1.0] }
	)
	intersectionObserver.observe(triggerElement)

	// add scroll tracking for position changes
	const checkPositionChange = () => {
		const newRect = triggerElement.getBoundingClientRect()
		if (
			Math.abs(lastRect.left - newRect.left) > 0.5 ||
			Math.abs(lastRect.top - newRect.top) > 0.5 ||
			Math.abs(lastRect.width - newRect.width) > 0.5 ||
			Math.abs(lastRect.height - newRect.height) > 0.5
		) {
			lastRect = newRect
			debouncedUpdate()
		}
	}

	// track scroll events on scrollable parents
	const scrollableParents: Element[] = []
	let scrollParent = triggerElement.parentElement
	while (scrollParent && scrollParent !== document.documentElement) {
		const computedStyle = window.getComputedStyle(scrollParent)
		if (
			computedStyle.overflow === 'auto' ||
			computedStyle.overflow === 'scroll' ||
			computedStyle.overflowX === 'auto' ||
			computedStyle.overflowX === 'scroll' ||
			computedStyle.overflowY === 'auto' ||
			computedStyle.overflowY === 'scroll'
		) {
			scrollableParents.push(scrollParent)
			scrollParent.addEventListener('scroll', checkPositionChange, {
				passive: true
			})
		}
		scrollParent = scrollParent.parentElement
	}

	// also listen to document scroll
	document.addEventListener('scroll', checkPositionChange, { passive: true })

	// observe DOM mutations with wider scope for position-affecting changes
	const mutationObserver = new MutationObserver(() => {
		// use RAF to batch multiple mutations
		requestAnimationFrame(checkPositionChange)
	})

	// observe the trigger element and its immediate container for changes
	const observeTarget = triggerElement.parentElement || document.body
	mutationObserver.observe(observeTarget, {
		attributes: true,
		attributeFilter: ['style', 'class', 'transform'],
		childList: true,
		subtree: true
	})

	window.addEventListener('resize', debouncedUpdate)

	return () => {
		targetResizeObserver.disconnect()
		popoverResizeObserver.disconnect()
		intersectionObserver.disconnect()
		mutationObserver.disconnect()
		window.removeEventListener('resize', debouncedUpdate)
		document.removeEventListener('scroll', checkPositionChange)

		// remove scroll listeners from scrollable parents
		for (const parent of scrollableParents) {
			parent.removeEventListener('scroll', checkPositionChange)
		}

		if (updateTimeout) clearTimeout(updateTimeout)
	}
}
