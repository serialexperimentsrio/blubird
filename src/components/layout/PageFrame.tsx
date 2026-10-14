'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { Lang } from '@/lib/lang'
import Header from './Header'
import Footer from './Footer'
import { NavigateContext, type FadeKind, type Navigate } from './TransitionLink'

const FADE_MS = 200

type PageFrameProps = {
	lang: Lang
	children: ReactNode
}

export default function PageFrame({ lang, children }: PageFrameProps) {
	const router = useRouter()
	const pathname = usePathname()
	// The fade belongs to the page it started on, so it clears itself once the
	// new pathname renders.
	const [fade, setFade] = useState<{ from: string; kind: FadeKind } | null>(null)
	const [isFooterVisible, setIsFooterVisible] = useState(false)
	const footerRef = useRef<HTMLElement>(null)
	const scrollableRef = useRef<HTMLDivElement>(null)

	const isFading = fade?.from === pathname
	const isLangFading = isFading && fade?.kind === 'lang'

	// Remember the language for the `/` redirect in middleware, and correct
	// <html lang>, which the root layout renders without knowing the language
	useEffect(() => {
		document.cookie = `NEXT_LANGUAGE=${lang}; path=/; max-age=31536000`
		document.documentElement.lang = lang
	}, [lang])

	useEffect(() => {
		const el = footerRef.current
		if (!el) return

		// Use threshold of 0.5 to detect when footer is meaningfully visible
		const observer = new IntersectionObserver(
			([entry]) => setIsFooterVisible(entry.isIntersecting),
			{ threshold: 0.5 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const scrollToTop = () => scrollableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

	const navigate: Navigate = async (href, kind = 'page') => {
		// Ignore clicks while a transition is already running
		if (isFading) return
		if (href === pathname) {
			scrollToTop()
			return
		}

		setFade({ from: pathname, kind })
		scrollToTop()

		// Wait for fade out animation to complete
		await new Promise((resolve) => setTimeout(resolve, FADE_MS))
		router.push(href)
	}

	return (
		<NavigateContext.Provider value={navigate}>
			<div
				style={{
					width: '100%',
					height: '100dvh',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Header lang={lang} isFadingOut={isLangFading} />

				<div ref={scrollableRef} className="scrollable-container">
					<main className="page-content">
						<div
							key={pathname}
							className="page-fade-in"
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								opacity: isFading ? 0 : 1,
								transition: 'opacity 0.3s ease-in-out',
							}}
						>
							{children}
						</div>

						{/* Footer Arrow Indicator */}
						<button
							type="button"
							className="page-fade-in"
							aria-label={
								isFooterVisible
									? (lang === 'ja' ? 'トップに戻る' : 'Back to top')
									: (lang === 'ja' ? 'フッターへ' : 'Scroll to footer')
							}
							onClick={() => {
								if (isFooterVisible) scrollToTop()
								else footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
							}}
							style={{
								position: 'absolute',
								bottom: '0.5rem',
								left: '50%',
								transform: `translateX(-50%) rotate(${isFooterVisible ? 180 : 0}deg)`,
								display: 'flex',
								justifyContent: 'center',
								background: 'none',
								border: 'none',
								padding: 0,
								font: 'inherit',
								color: 'var(--color-bright)',
								fontSize: '1.5rem',
								opacity: isFading ? 0 : 1,
								transition: 'transform 0.6s ease-in-out, opacity 0.3s ease-in-out',
								cursor: 'pointer',
								userSelect: 'none',
							}}
						>
							<span className="footer-arrow" aria-hidden="true">▾</span>
						</button>
					</main>

					<footer ref={footerRef}>
						<Footer lang={lang} />
					</footer>
				</div>
			</div>
		</NavigateContext.Provider>
	)
}
