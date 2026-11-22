/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { Tooltip } from 'ricebowl'
import Marquee from '@/components/special/Marquee'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'

type FooterProps = {
	lang: Lang
}

// Payoneer payment link, expires 2027-11-11: create a new one and replace USD.png + this URL before then
const TIP_LINK = 'https://link.payoneer.com/Token?t=8F74BE500C8A4450A727C1DD9B442D15&src=pl'

const FLAGS = [
	{ image: 'south_korea', alt: 'South Korea', wiki: 'South_Korea', en: 'I WAS BORN HERE', ja: 'ここで生まれ' },
	{ image: 'bangladesh', alt: 'Bangladesh', wiki: 'Bangladesh', en: 'I LIVE HERE', ja: 'ここに生き' },
	{ image: 'japan', alt: 'Japan', wiki: 'Japan', en: 'I WANT TO BE HERE', ja: 'ここにいたい' },
	{ image: 'palestine', alt: 'Palestine', wiki: 'Palestine', en: 'FREE PALESTINE', ja: 'パレスチナを解放せよ' },
	{ image: 'sudan', alt: 'Sudan', wiki: 'Sudan', en: 'EYES ON SUDAN', ja: 'スーダンに目を向けよう' },
	{ image: 'peace_blue', alt: 'Peace', wiki: 'Give_Peace_a_Chance', en: '✌', ja: '✌' },
]

const FLAG_SIZE = { height: '28px', width: '50px' }

const buttonReset = {
	background: 'none',
	padding: 0,
	font: 'inherit',
	cursor: 'pointer',
} as const

export default function Footer({ lang }: FooterProps) {
	const [copied, setCopied] = useState(false)
	const [tooltipText, setTooltipText] = useState('')
	const { isNarrow, isMedium, isSmall } = useBreakpoint()

	const scanText = lang === 'ja' ? 'スキャンするかリンクをコピー' : 'SCAN OR COPY LINK'
	const year = new Date().getFullYear()

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(TIP_LINK)
			setCopied(true)
			setTooltipText(lang === 'ja' ? 'コピーしました！' : 'COPIED!')
		} catch (err) {
			console.error('Failed to copy link:', err)
		}
	}

	const handleQREnter = () => {
		if (!copied) setTooltipText(scanText)
	}

	const handleQRLeave = () => {
		setCopied(false)
		// Swap the text back only after the tooltip has faded out
		setTimeout(() => setTooltipText(scanText), 400)
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
			{FLAGS.map((flag) => (
				<Tooltip key={flag.image} text={flag[lang]} above>
					<a href={`https://en.wikipedia.org/wiki/${flag.wiki}`} target="_blank" rel="noopener noreferrer">
						<img src={`/icons/flags/${flag.image}.png`} alt={flag.alt} style={FLAG_SIZE} className={styles.flagImg} />
					</a>
				</Tooltip>
			))}
		</div>
	)

	const copyright = (lang === 'ja' ? `著作権 ${year} 理央 • ` : `COPYRIGHT ${year} RIO • `).repeat(3)

	const marqueeBlock = (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: isSmall ? 'relative' : 'absolute', left: isSmall ? 0 : '50%', top: isSmall ? 0 : '50%', transform: isSmall ? 'none' : 'translate(-50%, -50%)', width: isSmall ? '100%' : '60%', height: isSmall ? 'auto' : '100%', color: 'var(--rb-color-bright)', fontSize: '1.2rem' }}>
			<Marquee text={copyright} speed={12} />
		</div>
	)

	const tipsBlock = (
		<div style={{ position: isSmall ? 'relative' : 'absolute', right: isSmall ? 0 : 'clamp(1rem, 5vw, 4rem)', top: isSmall ? 0 : '50%', transform: isSmall ? 'none' : 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: isSmall ? 'center' : 'flex-end', gap: '0', overflow: 'visible' }}>
			<div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', alignItems: 'center', gap: isNarrow ? '8px' : '16px', position: 'relative' }}>
				<div className={styles.tipMe} style={{ alignSelf: isNarrow ? 'center' : 'auto' }}>
					<span>{lang === 'ja' ? 'チップ' : 'TIPS'}</span>
					<span>{lang === 'ja' ? 'お願い!' : 'PLEASE!'}</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0' }}>
					<Tooltip text={lang === 'ja' ? 'カード/銀行で' : 'VIA CARD/BANK'} above>
						<a href={TIP_LINK} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rb-color-bright)', textDecoration: 'none', fontSize: '1.2rem', fontFamily: 'var(--font-maru-monica)', userSelect: 'none', height: '80px', minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', border: '2px solid var(--rb-color-accent)', borderRight: 'none' }}>
							USD
						</a>
					</Tooltip>
					<Tooltip text={tooltipText || scanText} above forceShow={copied}>
						<button
							type="button"
							aria-label={lang === 'ja' ? 'リンクをコピー' : 'Copy link'}
							onClick={handleCopyLink}
							onMouseEnter={handleQREnter}
							onMouseLeave={handleQRLeave}
							onFocus={handleQREnter}
							onBlur={handleQRLeave}
							style={{ ...buttonReset, height: '80px', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--rb-color-accent)' }}
						>
							<img src="/icons/qr/USD.png" alt={lang === 'ja' ? '支払いリンクのQRコード' : 'Payment link QR code'} style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
	)

	return (
		<div
			style={{
				width: '100%',
				background: 'var(--rb-color-main)',
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
	)
}
