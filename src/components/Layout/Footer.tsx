'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'

type FooterProps = {
	language: 'en' | 'ja'
}

export default function Footer({ language }: FooterProps) {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1270)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	return (
		<div
			style={{
				width: '100%',
				background: 'var(--blue)',
				pointerEvents: 'auto',
				scrollSnapAlign: 'start',
				scrollSnapStop: 'always',
				height: isMobile ? 'auto' : '126px',
				minHeight: isMobile ? 'auto' : undefined,
				overflow: isMobile ? 'visible' : 'hidden',
				position: 'relative',
				padding: isMobile ? '1.5rem clamp(1rem, 5vw, 4rem)' : '0 clamp(1rem, 5vw, 4rem)',
				display: isMobile ? 'flex' : 'block',
				flexDirection: isMobile ? 'column' : undefined,
				alignItems: isMobile ? 'center' : undefined,
				gap: isMobile ? '1.5rem' : undefined,
			}}
		>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '1.2rem',
					alignItems: 'center',
					position: isMobile ? 'relative' : 'absolute',
					left: isMobile ? 0 : '4rem',
					top: isMobile ? 0 : '50%',
					transform: isMobile ? 'none' : 'translateY(-50%)',
				}}
			>
				<WithTooltip text={language === 'ja' ? 'ここで生まれ' : 'I WAS BORN HERE'} above>
					<a
						href="https://en.wikipedia.org/wiki/South_Korea"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/south_korea.png"
							alt="South Korea"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
				<WithTooltip text={language === 'ja' ? 'ここに生き' : 'I LIVE HERE'} above>
					<a
						href="https://en.wikipedia.org/wiki/Bangladesh"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/bangladesh.png"
							alt="Bangladesh"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
				<WithTooltip text={language === 'ja' ? 'ここにいたい' : 'I WANT TO BE HERE'} above>
					<a
						href="https://en.wikipedia.org/wiki/Japan"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/japan.png"
							alt="Japan"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
				<WithTooltip text={language === 'ja' ? 'パレスチナを解放せよ' : 'FREE PALESTINE'} above>
					<a
						href="https://en.wikipedia.org/wiki/Palestine"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/palestine.png"
							alt="Palestine"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
				<WithTooltip text={language === 'ja' ? 'スーダンに目を向けよう' : 'EYES ON SUDAN'} above>
					<a
						href="https://en.wikipedia.org/wiki/Sudan"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/sudan.png"
							alt="Sudan"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
				<WithTooltip text={language === 'ja' ? '✌' : '✌'} above>
					<a
						href="https://en.wikipedia.org/wiki/Give_Peace_a_Chance"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="/flags/peace_blue.png"
							alt="Peace"
							width={42}
							height={28}
							unoptimized
							style={{ height: '28px', width: 'auto', imageRendering: 'pixelated', transition: 'transform 0.2s ease' }}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: isMobile ? 'relative' : 'absolute',
					left: isMobile ? 0 : '50%',
					top: isMobile ? 0 : '50%',
					transform: isMobile ? 'none' : 'translate(-50%, -50%)',
					width: isMobile ? '100%' : '60%',
					height: isMobile ? 'auto' : '100%',
					color: 'var(--white)',
					fontSize: '1.2rem',
				}}
			>
				<Marquee
					text={
						language === 'ja'
							? '著作権 2025 理央 • 著作権 2025 理央 • 著作権 2025 理央 • '
							: 'COPYRIGHT 2025 RIO • COPYRIGHT 2025 RIO • COPYRIGHT 2025 RIO • '
					}
					speed={12}
				/>
			</div>
		</div>
	)
}
