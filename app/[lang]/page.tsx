'use client'

export const runtime = 'edge';

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'
import AnimatedContent from '@/components/Special/AnimatedContent'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}


export default function Home({ params }: Props) {
	const router = useRouter()
	const [language, setLanguage] = useState<'en' | 'ja'>('ja')
	const [hoveredNav, setHoveredNav] = useState<string | null>(null)
	const [isFooterVisible, setIsFooterVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isFadingOut, setIsFadingOut] = useState(false)
	const footerRef = useRef<HTMLDivElement>(null)
	const scrollableRef = useRef<HTMLDivElement>(null)
	const lastHoveredRef = useRef<string | null>(null)
	const isTogglingRef = useRef(false)

	// Initialize language from route params
	useEffect(() => {
		const initializeLanguage = async () => {
			const resolvedParams = await params
			const lang = (resolvedParams.lang as 'en' | 'ja') || 'ja'
			setLanguage(lang)
			// Save preference to cookie
			document.cookie = `NEXT_LANGUAGE=${lang}; path=/; max-age=31536000`
			// Reset toggle guard when page loads
			isTogglingRef.current = false
			// Restore lastHoveredRef from sessionStorage
			const savedHovered = sessionStorage.getItem('lastHoveredNav')
			if (savedHovered) {
				lastHoveredRef.current = savedHovered
			}
		}
		initializeLanguage()
	}, [params])

	// Trigger animation and restore hover state after language changes
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Start animation and restore hover state together
			// They're in the same timeout so React batches them as one update
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

	useEffect(() => {
		const el = footerRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsFooterVisible(entry.isIntersecting)
			},
			{ threshold: 0.1 }
		)

		observer.observe(el)

		return () => {
			observer.unobserve(el)
		}
	}, [])

	const handleLogoClick = () => {
		router.push(`/${language}`)
	}

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
		router.push(`/${newLang}`)
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

			{/* Header */}
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '84px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'var(--blue)',
					zIndex: 10,
					pointerEvents: 'auto',
				}}
			>
				{/* Logo */}
				<div
					data-nav-item="logo"
					onClick={handleLogoClick}
					style={{
						position: 'absolute',
						left: '4rem',
						fontSize: '2rem',
						color: 'var(--white)',
						cursor: 'pointer',
						userSelect: 'none',
						fontFamily: 'var(--font-maru-monica)',
						fontWeight: 'bold',
						display: 'flex',
						alignItems: 'center',
						gap: '0.4rem',
					}}
					onMouseEnter={() => {
						setHoveredNav('logo')
						lastHoveredRef.current = 'logo'
						sessionStorage.setItem('lastHoveredNav', 'logo')
					}}
					onMouseLeave={() => {
					setHoveredNav(null)
					lastHoveredRef.current = null
					sessionStorage.removeItem('lastHoveredNav')
				}}
				>
					<div className={isFadingOut ? 'language-fade-out' : ''}>
						<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
							<span>{language === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!"}</span>
						</AnimatedContent>
					</div>
					<span
						className="nav-arrow"
						style={{
							opacity: hoveredNav === 'logo' && isAnimating ? 1 : 0,
							fontSize: '1.5rem',
							position: 'relative',
							zIndex: 1,
						}}
					>
						◂
					</span>
				</div>

				{/* Page Navigation */}
				<div
					style={{
						display: 'flex',
						gap: '3rem',
						fontSize: '1.4rem',
						fontFamily: 'var(--font-maru-monica)',
						color: 'var(--white)',
					}}
				>
					<div
						data-nav-item="diary"
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => {
							setHoveredNav('diary')
							lastHoveredRef.current = 'diary'
							sessionStorage.setItem('lastHoveredNav', 'diary')
						}}
						onMouseLeave={() => {
					setHoveredNav(null)
					lastHoveredRef.current = null
					sessionStorage.removeItem('lastHoveredNav')
				}}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'diary' && isAnimating ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<div className={isFadingOut ? 'language-fade-out' : ''}>
							<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
								<span>{language === 'ja' ? '日記' : 'DIARY'}</span>
							</AnimatedContent>
						</div>
					</div>
					<div
						data-nav-item="memories"
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => {
							setHoveredNav('memories')
							lastHoveredRef.current = 'memories'
							sessionStorage.setItem('lastHoveredNav', 'memories')
						}}
						onMouseLeave={() => {
					setHoveredNav(null)
					lastHoveredRef.current = null
					sessionStorage.removeItem('lastHoveredNav')
				}}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'memories' && isAnimating ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<div className={isFadingOut ? 'language-fade-out' : ''}>
							<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
								<span>{language === 'ja' ? '思い出' : 'MEMORIES'}</span>
							</AnimatedContent>
						</div>
					</div>
					<div
						data-nav-item="school"
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => {
							setHoveredNav('school')
							lastHoveredRef.current = 'school'
							sessionStorage.setItem('lastHoveredNav', 'school')
						}}
						onMouseLeave={() => {
					setHoveredNav(null)
					lastHoveredRef.current = null
					sessionStorage.removeItem('lastHoveredNav')
				}}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'school' && isAnimating ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<div className={isFadingOut ? 'language-fade-out' : ''}>
							<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
								<span>{language === 'ja' ? '学校' : 'SCHOOL'}</span>
							</AnimatedContent>
						</div>
					</div>
				</div>

				{/* Language Toggle */}
				<div
					data-nav-item="language"
					onClick={handleLanguageToggle}
					style={{
						position: 'absolute',
						right: '4rem',
						fontSize: '1.4rem',
						color: 'var(--white)',
						cursor: 'pointer',
						userSelect: 'none',
						fontFamily: 'var(--font-maru-monica)',
						display: 'flex',
						alignItems: 'center',
						gap: '0.2rem',
					}}
					onMouseEnter={() => {
						setHoveredNav('language')
						lastHoveredRef.current = 'language'
						sessionStorage.setItem('lastHoveredNav', 'language')
					}}
					onMouseLeave={() => {
					setHoveredNav(null)
					lastHoveredRef.current = null
					sessionStorage.removeItem('lastHoveredNav')
				}}
				>
					<span
						className="nav-arrow"
						style={{
							opacity: hoveredNav === 'language' && isAnimating ? 1 : 0,
							position: 'relative',
							zIndex: 1,
						}}
					>
						▸
					</span>
					<div className={isFadingOut ? 'language-fade-out' : ''}>
						<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
					<span>{language === 'ja' ? 'ENGLISH' : '日本語'}</span>
				</AnimatedContent>
					</div>
				</div>
			</div>

			{/* Scrollable Container */}
			<div
				ref={scrollableRef}
				className="scrollable-container"
				style={{
					position: 'fixed',
					top: '84px',
					left: 0,
					width: '100%',
					height: 'calc(100vh - 84px)',
					overflowY: 'scroll',
					scrollSnapType: 'y mandatory',
					scrollBehavior: 'smooth',
					zIndex: 1,
					pointerEvents: 'auto',
				}}
			>
				{/* Main Content Area*/}
				<div
					style={{
						width: '100%',
						height: 'calc(100vh - 84px)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '0 4rem',
						pointerEvents: 'auto',
						scrollSnapAlign: 'start',
						scrollSnapStop: 'always',
						position: 'relative',
					}}
				>
					{/* TODO: Put some content here */}

					{/* Footer Arrow Indicator */}
					<div
						style={{
							position: 'absolute',
							bottom: '1rem',
							left: '50%',
							transform: `translateX(-50%) rotate(${isFooterVisible ? 180 : 0}deg)`,
							display: 'flex',
							justifyContent: 'center',
							color: 'var(--white)',
							fontSize: '1.5rem',
							transition: 'transform 0.6s ease-in-out',
						}}
					>
						<span className="footer-arrow">▾</span>
					</div>
				</div>

				{/* Footer*/}
				<div
					ref={footerRef}
					style={{
						width: '100%',
						background: 'var(--blue)',
						pointerEvents: 'auto',
						scrollSnapAlign: 'start',
						scrollSnapStop: 'always',
						height: '126px',
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					{/* Flags */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: '1.2rem',
							alignItems: 'center',
							position: 'absolute',
							left: '4rem',
							top: '50%',
							transform: 'translateY(-50%)',
						}}
					>
						<WithTooltip text={language === 'ja' ? 'ここで生まれ' : 'I WAS BORN HERE'} above>
							<a
								href="https://en.wikipedia.org/wiki/South_Korea"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/south_korea.png"
									alt="South Korea"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
						<WithTooltip text={language === 'ja' ? 'ここに生き' : 'I LIVE HERE'} above>
							<a
								href="https://en.wikipedia.org/wiki/Bangladesh"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/bangladesh.png"
									alt="Bangladesh"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
						<WithTooltip text={language === 'ja' ? 'ここにいたい' : 'I WANT TO BE HERE'} above>
							<a
								href="https://en.wikipedia.org/wiki/Japan"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/japan.png"
									alt="Japan"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
						<WithTooltip text={language === 'ja' ? 'パレスチナを解放せよ' : 'FREE PALESTINE'} above>
							<a
								href="https://en.wikipedia.org/wiki/Palestine"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/palestine.png"
									alt="Palestine"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
						<WithTooltip text={language === 'ja' ? 'スーダンに目を向けよう' : 'EYES ON SUDAN'} above>
							<a
								href="https://en.wikipedia.org/wiki/Sudan"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/sudan.png"
									alt="Sudan"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
						<WithTooltip text={language === 'ja' ? '✌' : '✌'} above>
							<a
								href="https://en.wikipedia.org/wiki/Give_Peace_a_Chance"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none', display: 'inline-block' }}
							>
								<Image
									src="/flags/peace_blue.png"
									alt="Peace"
									width={28}
									height={28}
									style={{
										height: '28px',
										width: 'auto',
										cursor: 'pointer',
										transition: 'transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.2)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1)'
									}}
								/>
							</a>
						</WithTooltip>
					</div>
					{/* Marquee */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
							width: '60%',
							height: '100%',
							color: 'var(--white)',
							fontSize: '1.2rem',
						}}
					>
						<Marquee
						text={
							language === 'ja'
								? '著作権 2025 RIO • 著作権 2025 Rio • 著作権 2025 Rio • '
								: 'Copyright 2025 RIO • Copyright 2025 Rio • Copyright 2025 Rio • '
						}
						speed={12}
					/>
					</div>
				</div>
			</div>
		</div>
	)
}