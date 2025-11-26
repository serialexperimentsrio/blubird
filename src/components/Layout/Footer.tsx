'use client'

import Image from 'next/image'
import WithTooltip from '@/components/Tooltip'
import Marquee from '@/components/Special/Marquee'

type FooterProps = {
	language: 'en' | 'ja'
}

export default function Footer({ language }: FooterProps) {
	return (
		<div
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
							width={42}
							height={28}
							quality={100}
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
							width={42}
							height={28}
							quality={100}
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
							width={42}
							height={28}
							quality={100}
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
							width={42}
							height={28}
							quality={100}
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
							width={42}
							height={28}
							quality={100}
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
							width={42}
							height={28}
							quality={100}
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
							? '著作権 2025 理央 • 著作権 2025 理央 • 著作権 2025 理央 • '
							: 'Copyright 2025 RIO • Copyright 2025 RIO • Copyright 2025 RIO • '
					}
					speed={12}
				/>
			</div>
		</div>
	)
}
