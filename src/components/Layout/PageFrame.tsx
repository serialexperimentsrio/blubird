'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import WithTooltip from '@/components/Tooltip'

type PageFrameProps = {
	params: Promise<{ lang: 'en' | 'ja' }>
	children: (isFadingOut: boolean) => ReactNode
}

export default function PageFrame({ params, children }: PageFrameProps) {
	const router = useRouter()
	const [language, setLanguage] = useState<'en' | 'ja'>('ja')
	const [hoveredNav, setHoveredNav] = useState<string | null>(null)
	const [isFooterVisible, setIsFooterVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isFadingOut, setIsFadingOut] = useState(false)
	const [isArrowVisible, setIsArrowVisible] = useState(false)
	const [currentPage, setCurrentPage] = useState<string>('')
	const [hideSupportTooltip, setHideSupportTooltip] = useState(false)
	const footerRef = useRef<HTMLDivElement>(null)
	const scrollableRef = useRef<HTMLDivElement>(null)
	const lastHoveredRef = useRef<string | null>(null)
	const isTogglingRef = useRef(false)
	const hideTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Initialize language from route params
	useEffect(() => {
		const initializeLanguage = async () => {
			const resolvedParams = await params
			const lang = (resolvedParams.lang as 'en' | 'ja') || 'ja'
			setLanguage(lang)
			// Update document title immediately based on language
			document.title = lang === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!"
			// Save preference to cookie
			document.cookie = `NEXT_LANGUAGE=${lang}; path=/; max-age=31536000`
			// Reset all navigation states when page loads
			isTogglingRef.current = false
			setIsFadingOut(false)
			// Restore lastHoveredRef from sessionStorage
			const savedHovered = sessionStorage.getItem('lastHoveredNav')
			if (savedHovered) {
				lastHoveredRef.current = savedHovered
			}
			// Set current page from pathname
			const currentPath = window.location.pathname.replace(/^\/(en|ja)/, '')
			setCurrentPage(currentPath || '/')
		}
		initializeLanguage()
	}, [params])

	// Update document title based on language (for toggle)
	useEffect(() => {
		document.title = language === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!"
	}, [language])

	// Trigger animation and restore hover state after language changes
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsAnimating(true)
			setIsFadingOut(false)
			if (lastHoveredRef.current) {
				setHoveredNav(lastHoveredRef.current)
			}
		}, 100)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [language])

	// Fade in scroll indicator
	useEffect(() => {
		const timer = setTimeout(() => setIsArrowVisible(true), 50)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		const el = footerRef.current
		if (!el) return

		// Use threshold of 0.5 to detect when footer is meaningfully visible
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsFooterVisible(entry.isIntersecting)
			},
			{ threshold: 0.5 }
		)

		observer.observe(el)

		return () => {
			observer.unobserve(el)
		}
	}, [])

	useEffect(() => {
		const scrollEl = scrollableRef.current
		if (!scrollEl) return

		const handleScroll = () => {
			setHideSupportTooltip(true)
			if (hideTooltipTimeoutRef.current) {
				clearTimeout(hideTooltipTimeoutRef.current)
			}
			hideTooltipTimeoutRef.current = setTimeout(() => {
				setHideSupportTooltip(false)
				hideTooltipTimeoutRef.current = null
			}, 800)
		}

		scrollEl.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			scrollEl.removeEventListener('scroll', handleScroll)
			if (hideTooltipTimeoutRef.current) {
				clearTimeout(hideTooltipTimeoutRef.current)
			}
		}
	}, [])

	const handleLanguageToggle = async () => {
		// Prevent rapid toggles
		if (isTogglingRef.current) return
		isTogglingRef.current = true

		const newLang = language === 'ja' ? 'en' : 'ja'

		// Start fade out animation for current language text
		setIsFadingOut(true)
		setHoveredNav(null)

		// Smooth scroll to top
		if (scrollableRef.current) {
			scrollableRef.current.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		}

		// Save preference
		document.cookie = `NEXT_LANGUAGE=${newLang}; path=/; max-age=31536000`

		// Wait for fade out animation to complete
		await new Promise(resolve => setTimeout(resolve, 200))
		
		// Get current path without language prefix
		const currentPath = window.location.pathname.replace(/^\/(en|ja)/, '')
		router.push(`/${newLang}${currentPath}`)
		
		// Reset toggle guard after navigation starts
		setTimeout(() => {
			isTogglingRef.current = false
		}, 300)
	}

	const handleNavigate = async (path: string) => {
		// Prevent rapid navigation
		if (isTogglingRef.current) return
		isTogglingRef.current = true

		// Start fade out animation for current content
		setIsFadingOut(true)
		setHoveredNav(null)

		// Smooth scroll to top
		if (scrollableRef.current) {
			scrollableRef.current.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		}

		// Wait for fade out animation to complete
		await new Promise(resolve => setTimeout(resolve, 200))
		
		// Navigate to new page
		router.push(`/${language}${path}`)
		
		// Reset toggle guard after navigation starts
		// This ensures it's ready for the next page load
		setTimeout(() => {
			isTogglingRef.current = false
		}, 300)
	}

	return (
		<div
			style={{
				width: '100%',
				height: '100vh',
				position: 'relative',
				overflow: 'hidden',
				scrollBehavior: 'smooth',
			}}
		>
			<style>{`
				@keyframes footerBounce {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-8px);
					}
				}

				.footer-arrow {
					animation: footerBounce 0.6s ease-in-out infinite;
					display: inline-block;
				}

				@keyframes fadeOut {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}

				.language-fade-out {
					animation: fadeOut 0.2s ease-in-out forwards;
				}

				/* Hide scrollbar while keeping scroll functionality */
				.scrollable-container {
					scrollbar-width: none;
					-ms-overflow-style: none;
				}

				.scrollable-container::-webkit-scrollbar {
					display: none;
				}
			`}</style>

			<Header
				language={language}
				hoveredNav={hoveredNav}
				setHoveredNav={setHoveredNav}
				lastHoveredRef={lastHoveredRef}
				isAnimating={isAnimating}
				isFadingOut={isFadingOut}
				onLanguageToggle={handleLanguageToggle}
				onNavigate={handleNavigate}
				currentPage={currentPage}
			/>

			{/* Scrollable Container */}
			<div
				ref={scrollableRef}
				className="scrollable-container fixed left-0 w-full z-[1] pointer-events-auto overflow-y-scroll snap-y snap-mandatory scroll-smooth top-[84px] h-[calc(100vh-84px)]"
			>
				{/* Main Content Area */}
				<div
					className="page-content w-full flex flex-col items-center justify-center pointer-events-auto snap-start snap-always relative flex-shrink-0 box-border min-h-[calc(100vh-84px)] px-16"
				>
					{children(isFadingOut)}

					{/* Footer Arrow Indicator */}
					<div
						style={{
							position: 'absolute',
							bottom: '0.5rem',
							left: '50%',
							transform: `translateX(-50%) rotate(${isFooterVisible ? 180 : 0}deg)`,
							display: 'flex',
							justifyContent: 'center',
							color: 'var(--white)',
							fontSize: '1.5rem',
							opacity: isFadingOut ? 0 : (isArrowVisible ? 1 : 0),
							transition: 'transform 0.6s ease-in-out, opacity 0.3s ease-in-out',
						}}
					>
						<span className="footer-arrow">▾</span>
					</div>
				</div>

				{/* Footer */}
				<div ref={footerRef}>
					<Footer language={language} />
				</div>
			</div>
		</div>
	)
}
