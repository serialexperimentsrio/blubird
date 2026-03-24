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
			scrollParent.addEventListener('scroll', debouncedUpdate, {
				passive: true
			})
		}
		scrollParent = scrollParent.parentElement
	}

	// also listen to document scroll
	document.addEventListener('scroll', debouncedUpdate, { passive: true })

	// observe DOM mutations with wider scope for position-affecting changes
	const mutationObserver = new MutationObserver(() => {
		// use RAF to batch multiple mutations
		requestAnimationFrame(debouncedUpdate)
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
		mutationObserver.disconnect()
		window.removeEventListener('resize', debouncedUpdate)
		document.removeEventListener('scroll', debouncedUpdate)

		// remove scroll listeners from scrollable parents
		for (const parent of scrollableParents) {
			parent.removeEventListener('scroll', debouncedUpdate)
		}

		if (updateTimeout) clearTimeout(updateTimeout)
	}
}
