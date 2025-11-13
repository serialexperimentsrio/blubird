'use client'

export const runtime = 'edge';

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'

type Props = {
	params: Promise<{ lang: 'en' | 'ja' }>
}

export default function Home({ params }: Props) {
	const router = useRouter()
	const [language, setLanguage] = useState<'en' | 'ja'>('ja')
	const [hoveredNav, setHoveredNav] = useState<string | null>(null)
	const [isFooterVisible, setIsFooterVisible] = useState(false)
	const footerRef = useRef<HTMLDivElement>(null)
	const scrollableRef = useRef<HTMLDivElement>(null)

	// Initialize language from route params
	useEffect(() => {
		const initializeLanguage = async () => {
			const resolvedParams = await params
			const lang = (resolvedParams.lang as 'en' | 'ja') || 'ja'
			setLanguage(lang)
			// Save preference to cookie
			document.cookie = `NEXT_LANGUAGE=${lang}; path=/; max-age=31536000`
		}
		initializeLanguage()
	}, [params])

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsFooterVisible(entry.isIntersecting)
			},
			{ threshold: 0.1 }
		)

		if (footerRef.current) {
			observer.observe(footerRef.current)
		}

		return () => {
			if (footerRef.current) {
				observer.unobserve(footerRef.current)
			}
		}
	}, [])

	const handleLogoClick = () => {
		router.push(`/${language}`)
	}

	const handleLanguageToggle = async () => {
		const newLang = language === 'ja' ? 'en' : 'ja'

		// Smooth scroll to top
		if (scrollableRef.current) {
			scrollableRef.current.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		}

		// Save preference
		document.cookie = `NEXT_LANGUAGE=${newLang}; path=/; max-age=31536000`

		// Navigate after scroll completes
		await new Promise(resolve => setTimeout(resolve, 300))
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
					onMouseEnter={() => setHoveredNav('logo')}
					onMouseLeave={() => setHoveredNav(null)}
				>
					<span>{language === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!"}</span>
					<span
						className="nav-arrow"
						style={{
							opacity: hoveredNav === 'logo' ? 1 : 0,
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
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => setHoveredNav('diary')}
						onMouseLeave={() => setHoveredNav(null)}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'diary' ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<span>{language === 'ja' ? '日記' : 'DIARY'}</span>
					</div>
					<div
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => setHoveredNav('memories')}
						onMouseLeave={() => setHoveredNav(null)}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'memories' ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<span>{language === 'ja' ? '思い出' : 'MEMORIES'}</span>
					</div>
					<div
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.2rem',
							minHeight: '1.4rem',
						}}
						onMouseEnter={() => setHoveredNav('school')}
						onMouseLeave={() => setHoveredNav(null)}
					>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'school' ? 1 : 0,
								position: 'relative',
								zIndex: 1,
							}}
						>
							▸
						</span>
						<span>{language === 'ja' ? '学校' : 'SCHOOL'}</span>
					</div>
				</div>

				{/* Language Toggle */}
				<div
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
					onMouseEnter={() => setHoveredNav('language')}
					onMouseLeave={() => setHoveredNav(null)}
				>
					<span
						className="nav-arrow"
						style={{
							opacity: hoveredNav === 'language' ? 1 : 0,
							position: 'relative',
							zIndex: 1,
						}}
					>
						▸
					</span>
					<span>{language === 'ja' ? 'ENGLISH' : '日本語'}</span>
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
								<img
									src="/flags/south_korea.png"
									alt="South Korea"
									style={{
										height: '28px',
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
								<img
									src="/flags/bangladesh.png"
									alt="Bangladesh"
									style={{
										height: '28px',
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
								<img
									src="/flags/japan.png"
									alt="Japan"
									style={{
										height: '28px',
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
								<img
									src="/flags/palestine.png"
									alt="Palestine"
									style={{
										height: '28px',
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
								<img
									src="/flags/sudan.png"
									alt="Sudan"
									style={{
										height: '28px',
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
								<img
									src="/flags/peace_blue.png"
									alt="Peace"
									style={{
										height: '28px',
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