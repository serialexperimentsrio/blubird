'use client'

import { createContext, useContext, type ComponentProps } from 'react'
import Link from 'next/link'

export type FadeKind = 'page' | 'lang'
export type Navigate = (href: string, kind?: FadeKind) => void

// Provided by PageFrame, which owns the fade-out state
export const NavigateContext = createContext<Navigate>(() => {})

type TransitionLinkProps = ComponentProps<typeof Link> & {
	href: string
	fade?: FadeKind
}

// A Link that fades the current page out before navigating.
// Modified clicks (new tab, new window, ...) keep the native link behavior.
export default function TransitionLink({ href, fade = 'page', onClick, ...props }: TransitionLinkProps) {
	const navigate = useContext(NavigateContext)
	return (
		<Link
			href={href}
			{...props}
			onClick={(e) => {
				onClick?.(e)
				if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
				e.preventDefault()
				navigate(href, fade)
			}}
		/>
	)
}
