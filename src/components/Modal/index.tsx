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

// generation counter to track modal transitions and prevent stale callbacks
let modalGeneration = 0

// register a close animation function
export const registerCloseAnimation = (
	closeFunction: (isNested?: boolean) => void
) => {
	closeInnerModalFn = closeFunction
}

// global flag to indicate we're in a modal transition
let isTransitioningBetweenModals = false
export const isModalTransitioning = () => isTransitioningBetweenModals

// clear any pending timeouts and reset transition state
const clearModalTimeout = () => {
	if (modalTimeoutId !== undefined) {
		clearTimeout(modalTimeoutId)
		modalTimeoutId = undefined
		isTransitioningBetweenModals = false
	}
}

// helper to add a unique key to modal content
const addKeyToModalContent = (content: React.ReactNode): React.ReactNode => {
	if (content && typeof content === 'object' && 'type' in content) {
		const uniqueKey = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
		return React.cloneElement(content, { key: uniqueKey })
	}
	return content
}

// set modal content and show it
export const setModal = (content: React.ReactNode, onClose?: () => void) => {
	if (currentModal != null) {
		previousModal = currentModal
		previousOnClose = onCloseCallback
	}

	clearModalTimeout()

	modalGeneration++
	const currentGeneration = modalGeneration

	const contentWithKey = addKeyToModalContent(content)

	// simple open when no modal is active
	if (!modalActive && !isTransitioningBetweenModals) {
		currentModal = contentWithKey
		onCloseCallback = onClose
		modalActive = true
		if (portalUpdateFn) portalUpdateFn({})
		return
	}

	// nested modal transition
	isTransitioningBetweenModals = true

	if (closeInnerModalFn) closeInnerModalFn(true)

	modalActive = false
	if (portalUpdateFn) portalUpdateFn({})

	const pendingContent = contentWithKey
	const pendingOnClose = onClose

	modalTimeoutId = window.setTimeout(() => {
		if (currentGeneration !== modalGeneration) return

		currentModal = undefined
		if (portalUpdateFn) portalUpdateFn({})

		window.setTimeout(() => {
			if (currentGeneration !== modalGeneration) return

			currentModal = pendingContent
			onCloseCallback = pendingOnClose
			modalActive = true
			isTransitioningBetweenModals = false
			if (portalUpdateFn) portalUpdateFn({})
		}, 16)
	}, ANIMATION_CONFIG.nestedTransition.duration)
}

// hide the modal
export const hideModal = () => {
	previousModal = undefined
	previousOnClose = undefined

	if (!modalActive) return

	clearModalTimeout()

	modalActive = false

	if (closeInnerModalFn) closeInnerModalFn(false)

	if (portalUpdateFn) portalUpdateFn({})

	modalTimeoutId = window.setTimeout(() => {
		if (!modalActive) {
			currentModal = undefined
			isTransitioningBetweenModals = false
			if (portalUpdateFn) portalUpdateFn({})
		}
	}, ANIMATION_CONFIG.modalTransition.duration)
}

// function to force update the modal portal
let portalUpdateFn: ((value: Record<string, never>) => void) | null = null

// modal portal component
const ModalPortal = () => {
	const [, forceUpdate] = useState({})

	useEffect(() => {
		portalUpdateFn = forceUpdate
		return () => {
			portalUpdateFn = null
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && modalActive) hideModal()
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<>
			<div
				onClick={() => (onCloseCallback || hideModal)()}
				className={`${style.modalBackdrop} ${modalActive ? style.active : ''}`}
			/>
			{currentModal}
		</>
	)
}

// track if portal is initialized
let portalInitialized = false

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
	if (!previousModal) return
	setModal(previousModal, previousOnClose)
	previousModal = undefined
	previousOnClose = undefined
}

initModalPortal()
