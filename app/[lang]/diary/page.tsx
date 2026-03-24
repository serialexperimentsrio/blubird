"use client"

export const runtime = 'edge'

import React, { useEffect, useState } from 'react'
import PageFrame from '@/components/shared/Layout/PageFrame'
import Diary from '@/components/pagewise/Diary'

type Params = {
	lang: 'en' | 'ja'
}

export default function DiaryPage({ params }: { params: Promise<Params> }) {
	const [isVisible, setIsVisible] = useState(false)
	const [lang, setLang] = useState<'en' | 'ja' | null>(null)
	const [entries, setEntries] = useState<string[] | null>(null)

	useEffect(() => {
		params.then((resolved) => {
			setLang(resolved.lang)
		})
		const timer = setTimeout(() => setIsVisible(true), 50)
		return () => clearTimeout(timer)
	}, [params])

	useEffect(() => {
		if (!lang) return
		let cancelled = false
		const tryFetch = async () => {
			const candidates = [
				`/diary/${encodeURIComponent(lang)}/manifest.json`,
				`/diary/${encodeURIComponent(lang)}/manifest.json?ts=${Date.now()}`,
				`/diary/manifest.json`,
			]
			for (const url of candidates) {
				try {
					const r = await fetch(url)
					if (!r.ok) throw new Error(`${url} -> ${r.status}`)
					const data = await r.json()
					if (!cancelled && Array.isArray(data.files)) {
						setEntries(data.files.slice().sort().reverse())
						return
					}
				} catch (err) {
					console.error('Manifest fetch failed for', url, err)
				}
			}
			if (!cancelled) setEntries([])
		}
		tryFetch()
		return () => {
			cancelled = true
		}
	}, [lang])

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<div style={{
					opacity: isFadingOut ? 0 : (isVisible ? 1 : 0),
					transition: 'opacity 0.3s ease-in-out',
					width: '100%',
					maxHeight: 'calc(100dvh - 84px - 3rem)',
					overflow: 'visible',
				}}>
					<Diary entries={entries} lang={lang ?? 'en'} />
				</div>
			)}
		</PageFrame>
	)
}
