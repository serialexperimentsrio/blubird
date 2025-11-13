import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ANIMATION_CONFIG } from './animationConfig'
import style from './style.module.css'

// global state for modals
let currentModal: React.ReactNode | undefined
let previousModal: React.ReactNode | undefined
let previousOnClose: (() => void) | undefined
export let modalActive = false
let onCloseCallback: (() => void) | undefined
let closeInnerModalFn: ((isNested?: boolean) => void) | undefined

// single global timeout id to track any pending modal actions
let modalTimeoutId: number | undefined

// register a close animation function
// now accepts a boolean that indicates if it's a nested modal transition
export const registerCloseAnimation = (
	closeFunction: (isNested?: boolean) => void
) => {
	closeInnerModalFn = closeFunction
}

// global flag to indicate we're in a modal transition
let isTransitioningBetweenModals = false
export const isModalTransitioning = () => isTransitioningBetweenModals

// clear any pending timeouts
const clearModalTimeout = () => {
	if (modalTimeoutId !== undefined) {
		clearTimeout(modalTimeoutId)
		modalTimeoutId = undefined
	}
}

// helper to add a unique key to modal content
const addKeyToModalContent = (content: React.ReactNode): React.ReactNode => {
	// only process ReactElement (not strings, numbers, etc)
	if (content && typeof content === 'object' && 'type' in content) {
		// generate a random key
		const uniqueKey = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

		// clone with new key prop
		return React.cloneElement(content, { key: uniqueKey })
	}

	// if not a valid element, return as is
	return content
}

// set modal content and show it
export const setModal = (content: React.ReactNode, onClose?: () => void) => {
	if (currentModal != null) {
		previousModal = currentModal
		previousOnClose = onCloseCallback
	}

	// always clear any pending timeouts first
	clearModalTimeout()

	// add unique key to content
	const contentWithKey = addKeyToModalContent(content)

	// simple open when no modal is active
	if (!modalActive && !isTransitioningBetweenModals) {
		currentModal = contentWithKey
		onCloseCallback = onClose
		modalActive = true

		// force update the portal to show modal
		if (portalUpdateFn) {
			portalUpdateFn({})
		}
		return
	}

	// if modal is active or transitioning, this is a nested modal transition
	isTransitioningBetweenModals = true

	// start close animation with nested=true
	// this starts the normal close animation but we'll interrupt it after nestedTransition.duration
	if (closeInnerModalFn) {
		closeInnerModalFn(true) // pass true to indicate this is a nested modal transition
	}

	// DON'T mark modal as inactive - keep backdrop active during transition
	// modalActive = false // <-- removed this to keep backdrop visible

	// update UI but backdrop stays active
	if (portalUpdateFn) {
		portalUpdateFn({})
	}

	// after nestedTransition.duration, cancel the close animation and open the new modal
	modalTimeoutId = window.setTimeout(() => {
		// clear current content (this interrupts the close animation)
		currentModal = undefined

		// force update to ensure clean unmount
		if (portalUpdateFn) {
			portalUpdateFn({})
		}

		// slight delay before opening new modal
		window.setTimeout(() => {
			// set new modal content
			currentModal = contentWithKey
			onCloseCallback = onClose
			modalActive = true // ensure it stays active
			isTransitioningBetweenModals = false

			// update UI
			if (portalUpdateFn) {
				portalUpdateFn({})
			}
		}, 16) // one frame delay
	}, ANIMATION_CONFIG.nestedTransition.duration)
}

// hide the modal
export const hideModal = () => {
	previousModal = undefined
	previousOnClose = undefined

	// if no modal is active, do nothing
	if (!modalActive) return

	// clear any pending timeouts
	clearModalTimeout()

	// mark modal as inactive
	modalActive = false

	// run close animation (not a nested transition)
	if (closeInnerModalFn) {
		closeInnerModalFn(false) // false means it's not a nested modal transition
	}

	// update UI to reflect inactive state
	if (portalUpdateFn) {
		portalUpdateFn({})
	}

	// calculate when to unmount content (before animation ends)
	const unmountDelay = Math.max(
		0,
		ANIMATION_CONFIG.modalTransition.duration -
			ANIMATION_CONFIG.modalTransition.unmountBeforeEnd
	)

	// clear content before animation fully finishes
	modalTimeoutId = window.setTimeout(() => {
		// only clear if still inactive
		if (!modalActive) {
			currentModal = undefined
			isTransitioningBetweenModals = false

			// final update after clearing content
			if (portalUpdateFn) {
				portalUpdateFn({})
			}
		}
	}, unmountDelay)
}

// function to force update the modal portal
let portalUpdateFn: ((value: Record<string, never>) => void) | null = null

// modal portal component
const ModalPortal = () => {
	const [, forceUpdate] = useState({})

	// store the update function for external use
	useEffect(() => {
		portalUpdateFn = forceUpdate
		return () => {
			portalUpdateFn = null
		}
	}, [])

	return (
		<>
			<div
				onClick={() => (onCloseCallback || hideModal)()}
				className={`${style.modalBackdrop} ${
					modalActive ? style.active : ''
				}`}
				style={{
					transition: `all ${ANIMATION_CONFIG.backdropTransition.duration}ms ${ANIMATION_CONFIG.backdropTransition.easing}`
				}}
			/>
			{currentModal}
		</>
	)
}

// track if portal is initialized
let portalInitialized = false

// initialize the modal portal
const initModalPortal = () => {
	if (typeof document === 'undefined' || portalInitialized) return

	const portal = document.createElement('div')
	portal.id = 'modal-portal'
	document.body.appendChild(portal)

	ReactDOM.createRoot(portal).render(<ModalPortal />)

	portalInitialized = true
}

// open the previously closed modal
export const openPreviousModal = () => {
	// if no previous modal exists, do nothing
	if (!previousModal) return

	// use setModal to properly open the previous modal
	setModal(previousModal, previousOnClose)

	// clear previous modal references
	previousModal = undefined
	previousOnClose = undefined
}

initModalPortal()
