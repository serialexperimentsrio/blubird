'use client'

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

	const handleLogoClick = async () => {
		await onNavigate('')
	}

	const handleNavClick = async (path: string) => {
		await onNavigate(path)
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
			{/* Background */}
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					height: '84px',
					background: 'var(--blue)',
					zIndex: 10,
				}}
			/>
			
			{/* Logo and Language */}
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
					paddingLeft: '4rem',
					paddingRight: '4rem',
					zIndex: 11,
					pointerEvents: 'auto',
				}}
			>
				{/* Logo */}
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
			</div>			{/* Language Toggle */}
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
			</div>
			
			{/* Page Navigation - Centered exactly like COMING SOON */}
			<div
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
		</>
	)
}
