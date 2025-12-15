/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'

type FooterProps = {
	language: 'en' | 'ja'
}

const QR_CODES = [
	{ coin: 'BTC', image: '/qr/BTC.png', address: 'bc1q70vfcrf9x8hdu9vw9k2tcsz2qn9pm0a6nmxkvf' },
	{ coin: 'ETH', image: '/qr/ETH.png', address: '0xDC45c831D436b39FD91d20773e02bC190A474314' },
	{ coin: 'SOL', image: '/qr/SOL.png', address: 'DSUCtPUcXsiH2xsSpNmMQP9Vv97qbQM1eF1ha4KeSkNn' },
	{ coin: 'USDT', image: '/qr/USDT.png', address: '0xDC45c831D436b39FD91d20773e02bC190A474314' },
]

const HOVER_SCALE_STYLE = { height: '28px', width: '50px', imageRendering: 'pixelated' as const, transition: 'transform 0.2s ease' }
const COIN_CONTAINER_STYLE = { height: '60px', display: 'flex' as const, alignItems: 'center' as const, overflow: 'hidden' as const }
const COIN_BASE_STYLE = {
	height: '40px',
	width: 'auto' as const,
	imageRendering: 'pixelated' as const,
	cursor: 'pointer' as const,
	display: 'block' as const,
}

export default function Footer({ language }: FooterProps) {
	const [isMobile, setIsMobile] = useState(false)
	const [currentQRIndex, setCurrentQRIndex] = useState(0)
	const [copied, setCopied] = useState(false)
	const [tooltipText, setTooltipText] = useState('')
	const [isJumping, setIsJumping] = useState(false)
	const [coinGifKey, setCoinGifKey] = useState(0)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1270)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				setCoinGifKey(prev => prev + 1)
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
	}, [])

	const handleNextQR = () => {
		setCurrentQRIndex((prev) => (prev + 1) % QR_CODES.length)
	}

	const handleCopyAddress = async (e: React.MouseEvent) => {
		e.stopPropagation()
		try {
			await navigator.clipboard.writeText(QR_CODES[currentQRIndex].address)
			setCopied(true)
			setTooltipText(language === 'ja' ? 'コピーしました！' : 'COPIED!')
		} catch (err) {
			console.error('Failed to copy address:', err)
		}
	}

	const handleQRMouseEnter = () => {
		if (!copied) {
			setTooltipText(language === 'ja' ? 'スキャンするかアドレスをコピー' : 'SCAN OR COPY ADDRESS')
		}
	}

	const handleQRMouseLeave = () => {
		setCopied(false)
		setTimeout(() => {
			setTooltipText(language === 'ja' ? 'スキャンするかアドレスをコピー' : 'SCAN OR COPY ADDRESS')
		}, 400)
	}
	return (
		<div
			style={{
				width: '100%',
				background: 'var(--blue)',
				pointerEvents: 'auto',
				scrollSnapAlign: 'start',
				scrollSnapStop: 'always',
				height: isMobile ? 'auto' : '126px',
				minHeight: isMobile ? 'auto' : '126px',
				overflow: 'hidden',
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
					rowGap: '24px',
					columnGap: '20px',
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
						<img
							src="/flags/south_korea.png"
							alt="South Korea"
							style={HOVER_SCALE_STYLE}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</a>
				</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'ここに生き' : 'I LIVE HERE'} above>
				<a href="https://en.wikipedia.org/wiki/Bangladesh" target="_blank" rel="noopener noreferrer">
					<img
						src="/flags/bangladesh.png"
						alt="Bangladesh"
						style={HOVER_SCALE_STYLE}
						onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
					/>
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'ここにいたい' : 'I WANT TO BE HERE'} above>
				<a href="https://en.wikipedia.org/wiki/Japan" target="_blank" rel="noopener noreferrer">
					<img
						src="/flags/japan.png"
						alt="Japan"
						style={HOVER_SCALE_STYLE}
						onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
					/>
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'パレスチナを解放せよ' : 'FREE PALESTINE'} above>
				<a href="https://en.wikipedia.org/wiki/Palestine" target="_blank" rel="noopener noreferrer">
					<img
						src="/flags/palestine.png"
						alt="Palestine"
						style={HOVER_SCALE_STYLE}
						onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
					/>
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'スーダンに目を向けよう' : 'EYES ON SUDAN'} above>
				<a href="https://en.wikipedia.org/wiki/Sudan" target="_blank" rel="noopener noreferrer">
					<img
						src="/flags/sudan.png"
						alt="Sudan"
						style={HOVER_SCALE_STYLE}
						onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
					/>
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? '✌' : '✌'} above>
				<a href="https://en.wikipedia.org/wiki/Give_Peace_a_Chance" target="_blank" rel="noopener noreferrer">
					<img
						src="/flags/peace_blue.png"
						alt="Peace"
						style={HOVER_SCALE_STYLE}
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

			<div
				style={{
					position: isMobile ? 'relative' : 'absolute',
					right: isMobile ? 0 : 'clamp(1rem, 5vw, 4rem)',
					top: isMobile ? 0 : '50%',
					transform: isMobile ? 'none' : 'translateY(-50%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: isMobile ? 'center' : 'flex-end',
					gap: '1rem',
					overflow: 'hidden',
				}}
			>
			{!isJumping && (
				<WithTooltip text={language === 'ja' ? '理央をサポート！コインを送って！' : 'SUPPORT RIO! SEND COINS!'} above>
					<div style={COIN_CONTAINER_STYLE}>
						<img
							key={coinGifKey}
							src={`/coin.gif?v=${coinGifKey}`}
							alt="Coin"
							style={{ ...COIN_BASE_STYLE, transition: 'transform 0.2s ease' }}
							onClick={() => {
								const audio = new Audio('/coin.flac')
								audio.play().catch(err => console.error('Failed to play audio:', err))
								setIsJumping(true)
								setTimeout(() => {
									setIsJumping(false)
								}, 500)
							}}
							onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
							onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
						/>
					</div>
				</WithTooltip>
			)}
			{isJumping && (
				<div style={COIN_CONTAINER_STYLE}>
					<img
						key={coinGifKey}
						src={`/coin.gif?v=${coinGifKey}`}
						alt="Coin"
						style={{ ...COIN_BASE_STYLE, animation: 'coinJump 0.5s ease' }}
					/>
				</div>
			)}

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: '0',
				}}
			>
				<WithTooltip text={language === 'ja' ? '次のコイン' : 'NEXT COIN'} above>
					<div
						onClick={handleNextQR}
						style={{
							color: 'var(--white)',
							fontSize: '1.2rem',
							fontFamily: 'var(--font-maru-monica)',
							userSelect: 'none',
							height: '80px',
							minWidth: '80px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '0 1rem',
							border: '2px solid var(--blue-accent)',
							borderRight: 'none',
							cursor: 'pointer',
							position: 'relative',
						}}
					>
						<div style={{ position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
						<div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
						<div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
						<div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
						{QR_CODES[currentQRIndex].coin}
					</div>
				</WithTooltip>

				<WithTooltip text={tooltipText || (language === 'ja' ? 'スキャンするかアドレスをコピー' : 'SCAN OR COPY ADDRESS')} above forceShow={copied}>
					<div
						onClick={handleCopyAddress}
						onMouseEnter={handleQRMouseEnter}
						onMouseLeave={handleQRMouseLeave}
						style={{
							height: '80px',
							width: '80px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
							border: '2px solid var(--blue-accent)',
							cursor: 'pointer',
						}}
					>
						<img
							src={QR_CODES[currentQRIndex].image}
							alt={`${QR_CODES[currentQRIndex].coin} QR Code`}
							style={{
								height: '100%',
								width: '100%',
								objectFit: 'cover',
								display: 'block',
							}}
							onError={(e) => {
								console.error('Failed to load QR code:', QR_CODES[currentQRIndex].image)
								e.currentTarget.style.display = 'none'
							}}
						/>
					</div>
				</WithTooltip>
			</div>
		</div>
</div>
)
}