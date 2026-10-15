'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { siteTitle, type Lang } from '@/lib/lang'
import TransitionLink from './TransitionLink'

const NAV_ITEMS = [
	{ key: 'diary',    path: '/diary',    en: 'DIARY',    ja: '日記' },
	{ key: 'memories', path: '/memories', en: 'MEMORIES', ja: '思い出' },
	{ key: 'school',   path: '/school',   en: 'SCHOOL',   ja: '学校' },
] as const

const GUTTER = 'clamp(1rem, 5vw, 4rem)'
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'

// The header remounts when the language changes; this keeps the hovered item
// so its arrow comes back on the new page. Resets on a full reload.
let lastHovered: string | null = null

const linkReset: CSSProperties = {
	color: 'var(--rb-color-bright)',
	textDecoration: 'none',
	cursor: 'pointer',
	userSelect: 'none',
	fontFamily: 'var(--font-maru-monica)',
}

type NavLabelProps = {
	text: string
	showArrow: boolean
	isFadingOut: boolean
	// Logo arrow sits after the text and points back at it
	arrowAfter?: boolean
}

function NavLabel({ text, showArrow, isFadingOut, arrowAfter = false }: NavLabelProps) {
	return (
		<span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
			<span
				className="nav-arrow"
				aria-hidden="true"
				style={{
					opacity: showArrow ? 1 : 0,
					position: 'absolute',
					zIndex: 1,
					...(arrowAfter
						? { left: 'calc(100% + 0.5rem)', fontSize: '1.5rem' }
						: { right: 'calc(100% + 0.5rem)' }),
				}}
			>
				{arrowAfter ? '◂' : '▸'}
			</span>
			<span className={isFadingOut ? 'language-fade-out' : ''} style={{ display: 'block' }}>
				<span className="nav-slide-in">{text}</span>
			</span>
		</span>
	)
}

type HeaderProps = {
	lang: Lang
	isFadingOut: boolean
}

export default function Header({ lang, isFadingOut }: HeaderProps) {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isToggleHovered, setIsToggleHovered] = useState(false)
	const [hoveredNav, setHoveredNav] = useState<string | null>(lastHovered)
	const { isSmall } = useBreakpoint()

	// The menu only exists on small screens
	const menuOpen = isMenuOpen && isSmall

	const otherLang: Lang = lang === 'ja' ? 'en' : 'ja'
	const pagePath = pathname.slice(lang.length + 1)
	const isCurrent = (path: string) => pagePath === path || pagePath.startsWith(`${path}/`)

	useEffect(() => {
		if (!menuOpen) return
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsMenuOpen(false)
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [menuOpen])

	const hoverProps = (key: string) => ({
		onMouseEnter: () => {
			setHoveredNav(key)
			lastHovered = key
		},
		onMouseLeave: () => {
			setHoveredNav(null)
			lastHovered = null
		},
	})

	const langToggle = (style: CSSProperties) => (
		<TransitionLink
			href={`/${otherLang}${pagePath}`}
			hrefLang={otherLang}
			fade="lang"
			onClick={() => setHoveredNav(null)}
			{...hoverProps('language')}
			style={{ ...linkReset, fontSize: '1.4rem', display: 'flex', alignItems: 'center', ...style }}
		>
			<NavLabel
				text={lang === 'ja' ? 'ENGLISH' : '日本語'}
				showArrow={hoveredNav === 'language'}
				isFadingOut={isFadingOut}
			/>
		</TransitionLink>
	)

	return (
		<header>
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					minHeight: 'var(--header-height)',
					maxHeight: menuOpen ? '300px' : 'var(--header-height)',
					background: 'var(--rb-color-main)',
					zIndex: 10,
					transition: `max-height 0.35s ${EASE_OUT}`,
					paddingBottom: menuOpen ? '1rem' : '0',
					overflow: 'hidden',
				}}
			>
				<nav
					id="mobile-menu"
					aria-label={lang === 'ja' ? 'メニュー' : 'Menu'}
					inert={!menuOpen}
					style={{
						marginTop: 'var(--header-height)',
						display: 'flex',
						flexDirection: 'column',
						paddingLeft: GUTTER,
						paddingRight: GUTTER,
						maxHeight: menuOpen ? '500px' : '0px',
						overflow: 'hidden',
						transition: `max-height 0.4s ${EASE_OUT}`,
					}}
				>
					{NAV_ITEMS.map(({ key, path, en, ja }, i) => (
						<TransitionLink
							key={key}
							href={`/${lang}${path}`}
							aria-current={isCurrent(path) ? 'page' : undefined}
							onClick={() => setIsMenuOpen(false)}
							{...hoverProps(key)}
							style={{
								...linkReset,
								fontSize: '1.4rem',
								padding: '1rem',
								transition: 'background 0.15s ease',
								borderBottom: i < NAV_ITEMS.length - 1 ? '2px solid var(--rb-color-accent)' : 'none',
								background: hoveredNav === key ? 'var(--rb-color-accent)' : 'transparent',
								textDecorationLine: isCurrent(path) ? 'underline' : 'none',
								textUnderlineOffset: '0.3em',
							}}
						>
							{lang === 'ja' ? ja : en}
						</TransitionLink>
					))}
				</nav>
			</div>

			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					height: 'var(--header-height)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingLeft: GUTTER,
					paddingRight: GUTTER,
					zIndex: 11,
					pointerEvents: 'auto',
				}}
			>
				<TransitionLink
					href={`/${lang}`}
					{...hoverProps('logo')}
					style={{ ...linkReset, fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
				>
					<NavLabel text={siteTitle(lang)} showArrow={hoveredNav === 'logo'} isFadingOut={isFadingOut} arrowAfter />
				</TransitionLink>

				{!isSmall && langToggle({ width: '200px', justifyContent: 'flex-end' })}

				{isSmall && (
					<div
						style={{
							position: 'fixed',
							right: GUTTER,
							top: '0',
							height: 'var(--header-height)',
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
							zIndex: 11,
						}}
					>
						{langToggle({ justifyContent: 'center' })}
						<button
							type="button"
							aria-label={lang === 'ja' ? 'メニューを開閉' : 'Toggle menu'}
							aria-expanded={menuOpen}
							aria-controls="mobile-menu"
							onClick={() => setIsMenuOpen((open) => !open)}
							onMouseEnter={() => setIsToggleHovered(true)}
							onMouseLeave={() => setIsToggleHovered(false)}
							style={{
								background: isToggleHovered ? 'var(--rb-color-accent)' : 'var(--rb-color-main)',
								border: '2px solid var(--rb-color-accent)',
								color: 'var(--rb-color-bright)',
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
							}}
						>
							<span
								aria-hidden="true"
								style={{ display: 'inline-block', transition: 'transform 0.3s ease', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
							>
								▾
							</span>
						</button>
					</div>
				)}
			</div>

			{!isSmall && (
				<nav
					aria-label={lang === 'ja' ? 'メイン' : 'Main'}
					style={{
						position: 'fixed',
						top: '0',
						left: '0',
						right: '0',
						height: 'var(--header-height)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '1.4rem',
						fontFamily: 'var(--font-maru-monica)',
						color: 'var(--rb-color-bright)',
						zIndex: 12,
						pointerEvents: 'none',
					}}
				>
					<div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', pointerEvents: 'auto' }}>
						{NAV_ITEMS.map(({ key, path, en, ja }) => (
							<TransitionLink
								key={key}
								href={`/${lang}${path}`}
								aria-current={isCurrent(path) ? 'page' : undefined}
								{...hoverProps(key)}
								style={{
									...linkReset,
									width: '120px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									minHeight: '1.4rem',
									textDecorationLine: isCurrent(path) ? 'underline' : 'none',
									textUnderlineOffset: '0.3em',
								}}
							>
								<NavLabel text={lang === 'ja' ? ja : en} showArrow={hoveredNav === key} isFadingOut={isFadingOut} />
							</TransitionLink>
						))}
					</div>
				</nav>
			)}
		</header>
	)
}
