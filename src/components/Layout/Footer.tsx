/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'

type FooterProps = {
	language: 'en' | 'ja'
}

const QR_CODES = [
	{ coin: 'BTC', image: '/icons/qr/BTC.png', address: 'bc1q70vfcrf9x8hdu9vw9k2tcsz2qn9pm0a6nmxkvf' },
	{ coin: 'ETH', image: '/icons/qr/ETH.png', address: '0xDC45c831D436b39FD91d20773e02bC190A474314' },
	{ coin: 'SOL', image: '/icons/qr/SOL.png', address: 'DSUCtPUcXsiH2xsSpNmMQP9Vv97qbQM1eF1ha4KeSkNn' },
	{ coin: 'USDT', image: '/icons/qr/USDT.png', address: '0xDC45c831D436b39FD91d20773e02bC190A474314' },
]

const HOVER_SCALE_STYLE = { height: '28px', width: '50px', imageRendering: 'pixelated' as const }

export default function Footer({ language }: FooterProps) {
    
	const [currentQRIndex, setCurrentQRIndex] = useState(0)
	const [copied, setCopied] = useState(false)
	const [tooltipText, setTooltipText] = useState('')
	const [isFadingQR, setIsFadingQR] = useState(false)
	const { isNarrow, isMedium, isSmall } = useBreakpoint(500, 1270)

	const handleNextQR = async () => {
		setIsFadingQR(true)

		// Pause briefly so the fade out can finish
		await new Promise(resolve => setTimeout(resolve, 200))

		setCurrentQRIndex((prev) => (prev + 1) % QR_CODES.length)
		setIsFadingQR(false)
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

	// Prepare sections so we can reorder for squarish widths without modifying internals
	const flagsGrid = (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				rowGap: '24px',
				columnGap: '20px',
				alignItems: 'center',
				position: isSmall ? 'relative' : 'absolute',
				left: isSmall ? 0 : '4rem',
				top: isSmall ? 0 : '50%',
				transform: isSmall ? 'none' : 'translateY(-50%)',
			}}
		>
			<WithTooltip text={language === 'ja' ? 'ここで生まれ' : 'I WAS BORN HERE'} above>
				<a href="https://en.wikipedia.org/wiki/South_Korea" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/south_korea.png" alt="South Korea" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'ここに生き' : 'I LIVE HERE'} above>
				<a href="https://en.wikipedia.org/wiki/Bangladesh" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/bangladesh.png" alt="Bangladesh" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'ここにいたい' : 'I WANT TO BE HERE'} above>
				<a href="https://en.wikipedia.org/wiki/Japan" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/japan.png" alt="Japan" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'パレスチナを解放せよ' : 'FREE PALESTINE'} above>
				<a href="https://en.wikipedia.org/wiki/Palestine" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/palestine.png" alt="Palestine" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? 'スーダンに目を向けよう' : 'EYES ON SUDAN'} above>
				<a href="https://en.wikipedia.org/wiki/Sudan" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/sudan.png" alt="Sudan" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
			<WithTooltip text={language === 'ja' ? '✌' : '✌'} above>
				<a href="https://en.wikipedia.org/wiki/Give_Peace_a_Chance" target="_blank" rel="noopener noreferrer">
					<img src="/icons/flags/peace_blue.png" alt="Peace" style={HOVER_SCALE_STYLE} className="flag-img" />
				</a>
			</WithTooltip>
		</div>
	)

	const marqueeBlock = (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: isSmall ? 'relative' : 'absolute', left: isSmall ? 0 : '50%', top: isSmall ? 0 : '50%', transform: isSmall ? 'none' : 'translate(-50%, -50%)', width: isSmall ? '100%' : '60%', height: isSmall ? 'auto' : '100%', color: 'var(--white)', fontSize: '1.2rem' }}>
			<Marquee text={language === 'ja' ? '著作権 2025 理央 • 著作権 2025 理央 • 著作権 2025 理央 • ' : 'COPYRIGHT 2025 RIO • COPYRIGHT 2025 RIO • COPYRIGHT 2025 RIO • '} speed={12} />
		</div>
	)

	const tipsBlock = (
		<div style={{ position: isSmall ? 'relative' : 'absolute', right: isSmall ? 0 : 'clamp(1rem, 5vw, 4rem)', top: isSmall ? 0 : '50%', transform: isSmall ? 'none' : 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: isSmall ? 'center' : 'flex-end', gap: '0', overflow: 'visible' }}>
			<div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', alignItems: 'center', gap: isNarrow ? '8px' : '16px', position: 'relative' }}>
				<div className="tip-me" style={{ alignSelf: isNarrow ? 'center' : 'auto' }}>
					<span>{language === 'ja' ? 'チップ' : 'TIPS'}</span>
					<span>{language === 'ja' ? 'お願い!' : 'PLEASE!'}</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0' }}>
					<WithTooltip text={language === 'ja' ? '次のコイン' : 'NEXT COIN'} above>
						<div onClick={handleNextQR} style={{ color: 'var(--white)', fontSize: '1.2rem', fontFamily: 'var(--font-maru-monica)', userSelect: 'none', height: '80px', minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', border: '2px solid var(--blue-accent)', borderRight: 'none', cursor: 'pointer', position: 'relative' }}>
							<div style={{ position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
							<div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
							<div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
							<div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: 'var(--blue-accent)' }} />
							<span className={isFadingQR ? 'qr-fade-out' : 'qr-fade-in'}>{QR_CODES[currentQRIndex].coin}</span>
						</div>
					</WithTooltip>
					<WithTooltip text={tooltipText || (language === 'ja' ? 'スキャンするかアドレスをコピー' : 'SCAN OR COPY ADDRESS')} above forceShow={copied}>
						<div onClick={handleCopyAddress} onMouseEnter={handleQRMouseEnter} onMouseLeave={handleQRMouseLeave} style={{ height: '80px', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--blue-accent)', cursor: 'pointer' }}>
							<img src={QR_CODES[currentQRIndex].image} alt={`${QR_CODES[currentQRIndex].coin} QR Code`} style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
						</div>
					</WithTooltip>
				</div>
			</div>
		</div>
	)

	return (
		<>
			<style>{`
				@keyframes qrFadeOut {
					from { opacity: 1; }
					to { opacity: 0; }
				}
				@keyframes qrFadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.qr-fade-out {
					animation: qrFadeOut 0.2s ease-in-out forwards;
				}
				.qr-fade-in {
					animation: qrFadeIn 0.2s ease-in-out forwards;
				}
				@keyframes pulse {
					0%, 100% {
						opacity: 0.4;
					}
					50% {
						opacity: 1;
					}
				}
				.tip-me {
					display: flex;
					flex-direction: column;
					align-items: center;
					font-family: var(--font-maru-monica);
					font-size: 1.2rem;
					color: var(--white);
					background-color: var(--blue);
					padding: 8px;
					border: none;
					animation: pulse 1.5s ease-in-out infinite;
					gap: 4px;
				}
				.tip-me span {
					writing-mode: horizontal-tb;
					text-orientation: mixed;
				}
				.flag-img {
					transition: transform 0.2s ease;
				}
				.flag-img:hover {
					transform: scale(1.2);
				}
			`}</style>
			<div
				style={{
					width: '100%',
					background: 'var(--blue)',
					pointerEvents: 'auto',
					scrollSnapAlign: 'start',
					scrollSnapStop: 'always',
					height: isSmall ? 'auto' : '126px',
					minHeight: isSmall ? 'auto' : '126px',
					overflow: 'hidden',
					position: 'relative',
					padding: isSmall ? '1.5rem clamp(1rem, 5vw, 4rem)' : '0 clamp(1rem, 5vw, 4rem)',
					display: isSmall ? 'flex' : 'block',
					flexDirection: isSmall ? 'column' : undefined,
					alignItems: isSmall ? 'center' : undefined,
					gap: isSmall ? '1.5rem' : undefined,
				}}
			>
			{isMedium ? (
				<>
					<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
						{flagsGrid}
						{tipsBlock}
					</div>
					{marqueeBlock}
				</>
			) : isNarrow ? (
				<>
					{flagsGrid}
					{tipsBlock}
					{marqueeBlock}
				</>
			) : (
				<>
					{flagsGrid}
					{marqueeBlock}
					{tipsBlock}
				</>
			)}
		</div>
		</>
	)
}
