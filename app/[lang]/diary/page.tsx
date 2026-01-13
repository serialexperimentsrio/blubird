"use client"

export const runtime = 'edge'

import React, { useEffect, useState } from 'react'
import PageFrame from '@/components/Layout/PageFrame'
import ReadingPanel from '@/components/Diary/ReadingPanel'

type Params = {
	lang: 'en' | 'ja'
}

export default function DiaryPage({ params }: { params: Promise<Params> }) {
	const [isVisible, setIsVisible] = useState(false)
	const [lang, setLang] = useState<'en' | 'ja' | null>(null)
	const [files, setFiles] = useState<string[] | null>(null)

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
		fetch(`/api/diary/list?lang=${encodeURIComponent(lang)}`)
			.then((r) => r.json())
				.then((data) => {
					if (!cancelled && Array.isArray(data.files)) {
						setFiles(data.files.slice().sort().reverse())
					}
			})
			.catch(() => {
					if (!cancelled) setFiles([])
			})
		return () => {
			cancelled = true
		}
	}, [lang])

	return (
		<PageFrame params={params}>
			{(isFadingOut) => (
				<div style={{ opacity: isFadingOut ? 0 : (isVisible ? 1 : 0), transition: 'opacity 0.3s ease-in-out' }}>
					<ReadingPanel files={files} lang={lang ?? 'en'} />
				</div>
			)}
		</PageFrame>
	)
}

