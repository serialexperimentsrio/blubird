'use client'

import { useState, useEffect } from 'react'
import AnimatedContent from '@/components/Special/AnimatedContent'

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
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 1270
			setIsMobile(mobile)

			if (!mobile && isMenuOpen) {
				setIsMenuOpen(false)
			}
		}

		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [isMenuOpen])

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
					background: 'var(--blue)',
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
						<div
							onClick={() => handleNavClick('/diary')}
							style={{
								fontSize: '1.4rem',
								color: 'var(--white)',
								cursor: 'pointer',
								padding: '1rem 0',
								borderBottom: '2px solid var(--blue-accent)',
								fontFamily: 'var(--font-maru-monica)',
							}}
						>
							{language === 'ja' ? '日記' : 'DIARY'}
						</div>
						<div
							onClick={() => handleNavClick('/memories')}
							style={{
								fontSize: '1.4rem',
								color: 'var(--white)',
								cursor: 'pointer',
								padding: '1rem 0',
								borderBottom: '2px solid var(--blue-accent)',
								fontFamily: 'var(--font-maru-monica)',
							}}
						>
							{language === 'ja' ? '思い出' : 'MEMORIES'}
						</div>
						<div
							onClick={() => handleNavClick('/school')}
							style={{
								fontSize: '1.4rem',
								color: 'var(--white)',
								cursor: 'pointer',
								padding: '1rem 0',
								fontFamily: 'var(--font-maru-monica)',
							}}
						>
							{language === 'ja' ? '学校' : 'SCHOOL'}
						</div>
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
						color: 'var(--white)',
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
					<span
						className="nav-arrow"
						style={{
							opacity: hoveredNav === 'logo' && isAnimating ? 1 : 0,
							fontSize: '1.5rem',
							position: 'absolute',
							right: 'calc(100% + 0.5rem)',
							zIndex: 1,
						}}
					>
						▸
					</span>
					<div className={isFadingOut ? 'language-fade-out' : ''}>
						<AnimatedContent isVisible={isAnimating} useScrollTrigger={false} duration={0.4} distance={30} ease="cubic-bezier(0.16, 1, 0.3, 1)" initialOpacity={0} animateOpacity={true} reverse={true}>
							<span>{language === 'ja' ? '理央の世界〜!' : "RIO'S WORLD!"}</span>
						</AnimatedContent>
					</div>
				</div>
			</div>

				{!isMobile && (
					<div
						data-nav-item="language"
						onClick={onLanguageToggle}
						style={{
							width: '200px',
							fontSize: '1.4rem',
							color: 'var(--white)',
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

			{isMobile && (
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
				<div
					style={{
						fontSize: '2rem',
						color: 'var(--white)',
						transition: 'transform 0.3s ease',
						transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						userSelect: 'none',
					}}
				>
					▾
				</div>
			</div>
			)}
			</div>

			{!isMobile && (
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
					color: 'var(--white)',
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
				<div
					data-nav-item="diary"
					onClick={() => handleNavClick('/diary')}
					style={{
						width: '120px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '1.4rem',
						position: 'relative',
						textDecoration: currentPage === '/diary' ? 'underline' : 'none',
						textUnderlineOffset: '0.3em',
					}}
					onMouseEnter={() => handleNavHover('diary')}
					onMouseLeave={handleNavLeave}
				>
					<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'diary' && isAnimating ? 1 : 0,
								position: 'absolute',
								right: 'calc(100% + 0.5rem)',
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
				</div>
				<div
					data-nav-item="memories"
					onClick={() => handleNavClick('/memories')}
					style={{
						width: '120px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '1.4rem',
						position: 'relative',
						textDecoration: currentPage === '/memories' ? 'underline' : 'none',
						textUnderlineOffset: '0.3em',
					}}
					onMouseEnter={() => handleNavHover('memories')}
					onMouseLeave={handleNavLeave}
				>
					<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'memories' && isAnimating ? 1 : 0,
								position: 'absolute',
								right: 'calc(100% + 0.5rem)',
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
				</div>
				<div
					data-nav-item="school"
					onClick={() => handleNavClick('/school')}
					style={{
						width: '120px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '1.4rem',
						position: 'relative',
						textDecoration: currentPage === '/school' ? 'underline' : 'none',
						textUnderlineOffset: '0.3em',
					}}
					onMouseEnter={() => handleNavHover('school')}
					onMouseLeave={handleNavLeave}
				>
					<div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
						<span
							className="nav-arrow"
							style={{
								opacity: hoveredNav === 'school' && isAnimating ? 1 : 0,
								position: 'absolute',
								right: 'calc(100% + 0.5rem)',
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
				</div>
			</div>
			)}
		</>
	)
}
