'use client'

import { useState, useEffect, type MouseEvent } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import AnimatedContent from '@/components/special/AnimatedContent'

type HeaderProps = {
	language: 'en' | 'ja'
	hoveredNav: string | null
	setHoveredNav: (nav: string | null) => void
	lastHoveredRef: React.MutableRefObject<string | null>
	isAnimating: boolean
	isFadingOut: boolean
	onLanguageToggle: () => void
	onNavigate: (path: string) => Promise<void>
	currentPage: string
}

export default function Header({
	language,
	hoveredNav,
	setHoveredNav,
	lastHoveredRef,
	isAnimating,
	isFadingOut,
	onLanguageToggle,
	onNavigate,
	currentPage
}: HeaderProps) {

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isToggleHovered, setIsToggleHovered] = useState(false)
	const { isSmall } = useBreakpoint(500, 1270)

	// Reusable styles to reduce duplication
	const mobileNavItemBase: React.CSSProperties = {
		fontSize: '1.4rem',
		color: 'var(--color-bright)',
		cursor: 'pointer',
		padding: '1rem 1rem',
		fontFamily: 'var(--font-maru-monica)',
		transition: 'background 0.15s ease',
	}

	const mobileLangBox: React.CSSProperties = {
		fontSize: '1.4rem',
		color: 'var(--color-bright)',
		cursor: 'pointer',
		userSelect: 'none',
		fontFamily: 'var(--font-maru-monica)',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'auto',
	}

	const toggleButtonBox: React.CSSProperties = {
		background: isToggleHovered ? 'var(--color-accent)' : 'var(--color-main)',
		border: '2px solid var(--color-accent)',
		color: 'var(--color-bright)',
		width: '2.8rem',
		height: '2.8rem',
		padding: '0',
		boxSizing: 'border-box',
		borderRadius: '0',
		fontFamily: 'var(--font-maru-monica)',
		fontSize: '1.2rem',
		transition: 'background 0.15s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		userSelect: 'none',
	}

	useEffect(() => {
		if (!isSmall && isMenuOpen) {
			// Avoid synchronous setState inside the effect; schedule it asynchronously
			const id = setTimeout(() => setIsMenuOpen(false), 0)
			return () => clearTimeout(id)
		}
	}, [isSmall, isMenuOpen])

	const handleLogoClick = async () => {
		await onNavigate('')
	}

	const handleNavClick = async (path: string) => {
		setIsMenuOpen(false)
		await onNavigate(path)
	}

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleNavHover = (navItem: string) => {
		setHoveredNav(navItem)
		lastHoveredRef.current = navItem
		sessionStorage.setItem('lastHoveredNav', navItem)
	}

	const handleNavLeave = () => {
		setHoveredNav(null)
		lastHoveredRef.current = null
		sessionStorage.removeItem('lastHoveredNav')
	}

	return (
		<>
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					minHeight: '84px',
					maxHeight: isMenuOpen ? '300px' : '84px',
					background: 'var(--color-main)',
					zIndex: 10,
					transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
					paddingBottom: isMenuOpen ? '1rem' : '0',
					overflow: 'hidden',
				}}
			>
				<div
					data-mobile-menu="true"
					style={{
						marginTop: '84px',
						display: 'flex',
						flexDirection: 'column',
						gap: '0',
						paddingLeft: 'clamp(1rem, 5vw, 4rem)',
						paddingRight: 'clamp(1rem, 5vw, 4rem)',
						maxHeight: isMenuOpen ? '500px' : '0px',
						overflow: 'hidden',
						transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
					}}
				>
						<button
							onClick={() => handleNavClick('/diary')}
							onMouseEnter={() => handleNavHover('diary')}
							onMouseLeave={handleNavLeave}
							style={{
								...mobileNavItemBase,
								width: '100%',
								textAlign: 'left',
								border: 'none',
								borderBottom: '2px solid var(--color-accent)',
								background: hoveredNav === 'diary' ? 'var(--color-accent)' : 'transparent',
							}}
						>
							{language === 'ja' ? '日記' : 'DIARY'}
						</button>
						<button
							onClick={() => handleNavClick('/memories')}
							onMouseEnter={() => handleNavHover('memories')}
							onMouseLeave={handleNavLeave}
							style={{
								...mobileNavItemBase,
								width: '100%',
								textAlign: 'left',
								border: 'none',
								borderBottom: '2px solid var(--color-accent)',
								background: hoveredNav === 'memories' ? 'var(--color-accent)' : 'transparent',
							}}
						>
							{language === 'ja' ? '思い出' : 'MEMORIES'}
						</button>
						<button
							onClick={() => handleNavClick('/school')}
							onMouseEnter={() => handleNavHover('school')}
							onMouseLeave={handleNavLeave}
							style={{
								...mobileNavItemBase,
								width: '100%',
								textAlign: 'left',
								border: 'none',
								background: hoveredNav === 'school' ? 'var(--color-accent)' : 'transparent',
							}}
						>
							{language === 'ja' ? '学校' : 'SCHOOL'}
						</button>
					</div>
			</div>

			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					height: '84px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingLeft: 'clamp(1rem, 5vw, 4rem)',
					paddingRight: 'clamp(1rem, 5vw, 4rem)',
					zIndex: 11,
					pointerEvents: 'auto',
				}}
			>
				<div
					data-nav-item="logo"
					onClick={handleLogoClick}
					style={{
						fontSize: '2rem',
						color: 'var(--color-bright)',
						cursor: 'pointer',
						userSelect: 'none',
						fontFamily: 'var(--font-maru-monica)',
						fontWeight: 'bold',
						display: 'flex',
						alignItems: 'center',
						position: 'relative',
					}}
				onMouseEnter={() => handleNavHover('logo')}
				onMouseLeave={handleNavLeave}
			>
				<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
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
							position: 'absolute',
							left: 'calc(100% + 0.5rem)',
							zIndex: 1,
						}}
					>
						◂
					</span>
				</div>
			</div>

				{!isSmall && (
					<div
						data-nav-item="language"
						onClick={onLanguageToggle}
						style={{
							width: '200px',
							fontSize: '1.4rem',
							color: 'var(--color-bright)',
							cursor: 'pointer',
							userSelect: 'none',
							fontFamily: 'var(--font-maru-monica)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							position: 'relative',
						}}
						onMouseEnter={() => handleNavHover('language')}
						onMouseLeave={handleNavLeave}
					>
					<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'language' && isAnimating ? 1 : 0,
								position: 'absolute',
								right: 'calc(100% + 0.5rem)',
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
			)}

			{isSmall && (
				<div
					data-nav-hamburger="true"
					onClick={toggleMenu}
					style={{
						position: 'fixed',
						right: 'clamp(1rem, 5vw, 4rem)',
						top: '0',
						height: '84px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 11,
						cursor: 'pointer',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						<div
							data-nav-item="language"
							onClick={(e: MouseEvent) => { e.stopPropagation(); onLanguageToggle(); }}
							onMouseEnter={() => handleNavHover('language')}
							onMouseLeave={handleNavLeave}
							style={{
								...mobileLangBox,
							}}
						>
							<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
								<span
									className="nav-arrow"
									style={{
										opacity: hoveredNav === 'language' && isAnimating ? 1 : 0,
										position: 'absolute',
										right: 'calc(100% + 0.5rem)',
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
							<button
								type="button"
								aria-label="Toggle menu"
								onMouseEnter={() => setIsToggleHovered(true)}
								onMouseLeave={() => setIsToggleHovered(false)}
								style={toggleButtonBox}
							>
								<span style={{ display: 'inline-block', transition: 'transform 0.3s ease', transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
									▾
								</span>
							</button>
					</div>
				</div>
			)}
			</div>

			{!isSmall && (
				<div
					data-nav-desktop="true"
				style={{
					position: 'fixed',
					top: '0',
					left: '0',
					right: '0',
					height: '84px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '1.4rem',
					fontFamily: 'var(--font-maru-monica)',
					color: 'var(--color-bright)',
					zIndex: 12,
					pointerEvents: 'none',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '3rem',
						whiteSpace: 'nowrap',
						pointerEvents: 'auto',
					}}
				>
				{([
					{ key: 'diary',    path: '/diary',    en: 'DIARY',    ja: '日記' },
					{ key: 'memories', path: '/memories', en: 'MEMORIES', ja: '思い出' },
					{ key: 'school',   path: '/school',   en: 'SCHOOL',   ja: '学校' },
				] as const).map(({ key, path, en, ja }) => (
					<button
						key={key}
						data-nav-item={key}
						onClick={() => handleNavClick(path)}
						style={{
							width: '120px',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							minHeight: '1.4rem',
							position: 'relative',
							background: 'none',
							border: 'none',
							padding: 0,
							color: 'inherit',
							font: 'inherit',
							textDecoration: currentPage === path ? 'underline' : 'none',
							textUnderlineOffset: '0.3em',
						}}
						onMouseEnter={() => handleNavHover(key)}
						onMouseLeave={handleNavLeave}
					>
						<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
							<span
								className="nav-arrow"
								style={{
									opacity: hoveredNav === key && isAnimating ? 1 : 0,
									position: 'absolute',
									right: 'calc(100% + 0.5rem)',
									zIndex: 1,
								}}
							>
								▸
							</span>
							<div className={isFadingOut ? 'language-fade-out' : ''}>
								<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
									<span>{language === 'ja' ? ja : en}</span>
								</AnimatedContent>
							</div>
						</div>
					</button>
				))}
				</div>
			</div>
			)}
		</>
	)
}
