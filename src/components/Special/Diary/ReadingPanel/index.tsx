"use client"

import React, { useEffect, useState, useRef } from 'react'
import styles from './style.module.css'
import { useBreakpoint } from '@/hooks/useBreakpoint'

type Props = {
  files: string[] | null
  lang: string
  initialSelected?: string | null
  initialContent?: string | null
}

export default function ReadingPanel({ files, lang, initialSelected, initialContent }: Props) {
  const [selected, setSelected] = useState<string | null>(initialSelected ?? null)
  const [content, setContent] = useState<string>(initialContent ?? '')
  const [contentReady, setContentReady] = useState<boolean>(initialContent ? true : false)
  const [visible, setVisible] = useState<boolean>(false)
  const FADE_MS = 200
  const prevSelected = useRef<string | null>(null)
  // Enable transitions after mount (so initial appearance is immediate, then tab switches animate)
  const [withTransitions, setWithTransitions] = useState<boolean>(false)
  const [isSwitching, setIsSwitching] = useState<boolean>(false)
  // `selected` drives which file we fetch. `visualSelected` controls which tab
  // shows the active styling so we can delay the visual change until after
  // the synchronized transition completes.
  const [visualSelected, setVisualSelected] = useState<string | null>(initialSelected ?? null)
  const [initialized, setInitialized] = useState<boolean>(initialSelected ? true : false)

  // Parse text and convert Markdown links [text](url) and plain URLs into React nodes.
  function renderWithLinks(text: string) {
    const nodes: React.ReactNode[] = []
    let idx = 0
    const mdLink = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
    const urlRe = /(https?:\/\/[^\s]+)/g

    while (idx < text.length) {
      mdLink.lastIndex = idx
      urlRe.lastIndex = idx
      const m1 = mdLink.exec(text)
      const m2 = urlRe.exec(text)

      let nextIndex = text.length
      let match: RegExpExecArray | null = null
      let type: 'md' | 'url' | null = null

      if (m1 && m1.index < nextIndex) {
        nextIndex = m1.index
        match = m1
        type = 'md'
      }
      if (m2 && m2.index < nextIndex) {
        nextIndex = m2.index
        match = m2
        type = 'url'
      }

      if (!match || type === null) {
        nodes.push(text.slice(idx))
        break
      }

      if (match.index > idx) {
        nodes.push(text.slice(idx, match.index))
      }

      if (type === 'md') {
        const label = match[1]
        const href = match[2]
        nodes.push(
          <a key={nodes.length} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        )
        idx = match.index + match[0].length
      } else {
        const href = match[0]
        nodes.push(
          <a key={nodes.length} href={href} target="_blank" rel="noopener noreferrer">
            {href}
          </a>
        )
        idx = match.index + href.length
      }
    }

    return nodes
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      setWithTransitions(true)
      // Do not reveal yet — wait for `files` to finish loading so the
      // tab list is present and can animate together with the panel.
      }))
      return () => cancelAnimationFrame(raf)
  }, [])

  const isLoading = files === null
  const displayFiles = (files || []).filter((f) => !f.startsWith('.'))

  const { isSmall } = useBreakpoint(500, 1270)

  // Touch swipe handling for mobile: detect horizontal swipes on the panel
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const SWIPE_THRESHOLD = 50

  const selectPrev = () => {
    if (!selected) return
    const i = displayFiles.indexOf(selected)
    if (i < displayFiles.length - 1) {
      setVisualSelected(displayFiles[i + 1])
      requestAnimationFrame(() => setSelected(displayFiles[i + 1]))
    }
  }

  const selectNext = () => {
    if (!selected) return
    const i = displayFiles.indexOf(selected)
    if (i > 0) {
      setVisualSelected(displayFiles[i - 1])
      requestAnimationFrame(() => setSelected(displayFiles[i - 1]))
    }
  }

  // Reveal only after transitions are enabled and files have finished loading
  useEffect(() => {
    if (!withTransitions) return
    if (!isLoading) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(raf)
    }
  }, [withTransitions, isLoading])

  useEffect(() => {
    if (!selected) return
    let cancelled = false

    const fetchContent = async () => {
      // Mark content not-ready until this fetch completes to avoid showing
      // stale/duplicate text while a new fetch is in-flight.
      setContentReady(false)
      try {
        const url = `/diary/${encodeURIComponent(lang)}/${encodeURIComponent(selected)}`
        const r = await fetch(url)
        if (!r.ok) throw new Error('failed')
        const t = await r.text()
        if (cancelled) return
        setContent(t)
        setContentReady(true)
      } catch {
        if (!cancelled) {
          setContent('')
          setContentReady(true)
        }
      } finally {
        if (!cancelled) requestAnimationFrame(() => {
          // Show content, then keep the switching class active for the duration
          // of the fade so list and panel return to normal after the content is visible.
          setVisible(true)
          setTimeout(() => {
            setIsSwitching(false)
          }, FADE_MS)
        })
      }
    }

    // If prevSelected is null, this is initial mount/navigation back — don't animate out
    if (prevSelected.current === null) {
      setVisible(true)
      fetchContent()
      prevSelected.current = selected
      return () => {
        cancelled = true
      }
    }

    // Tab switch: start a switching animation (affects list + panel) and fetch immediately.
    if (withTransitions) {
      // Apply the switching class first, then hide via RAF so the transition has a start state
      setIsSwitching(true)
      requestAnimationFrame(() => {
        setVisible(false)
      })
    }
    fetchContent()

    prevSelected.current = selected
    return () => {
      cancelled = true
    }
  // `withTransitions` is intentionally omitted to avoid changing the
  // dependency array size between HMR updates. The fetch depends on
  // `selected` and `lang` only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, lang])

  useEffect(() => {
    if (displayFiles && displayFiles.length && !selected) {
      // Set visual selection first so the tab can paint, then start the
      // content fetch on the next animation frame. This ensures the tab
      // button appears before the panel content loads, avoiding a snap.
      const first = displayFiles[0]
      setVisualSelected(first)
      requestAnimationFrame(() => setSelected(first))
      setInitialized(true)
    }
  }, [displayFiles, selected])

  return (
    <div className={`${styles.container} ${isSmall ? styles.isSmall : ''} ${withTransitions ? styles.withTransitions : ''} ${isSwitching ? styles.switching : ''}`}>
      <div className={`${styles.list} ${visible ? styles.visible : styles.hidden}`}>
        {displayFiles.length === 0 ? (
          // If files are still loading, don't show the empty placeholder —
          // wait until the parent has finished fetching to avoid a flash.
          isLoading ? null : (
            <div className={styles.empty}>No files found</div>
          )
        ) : (
          displayFiles.map((f) => {
          const label = f.replace(/\.[^/.]+$/, '')
          return (
            <button
              key={f}
              className={`${styles.card} ${visualSelected === f ? styles.active : ''} ${visible ? styles.visible : styles.hidden}`}
              onClick={() => {
                if (selected === f) return
                // Paint the visual active state first, then set `selected`
                // on the next frame to allow the button to render before
                // the fetch and panel update begin.
                setVisualSelected(f)
                requestAnimationFrame(() => setSelected(f))
              }}
              aria-label={`Open ${label}`}
            >
              {label}
            </button>
          )
          })
        )}
      </div>

      <div
        className={styles.panel}
        onTouchStart={(e) => {
          if (!isSmall) return
          touchStartX.current = e.touches[0].clientX
          touchEndX.current = null
        }}
        onTouchMove={(e) => {
          if (!isSmall) return
          touchEndX.current = e.touches[0].clientX
        }}
        onTouchEnd={() => {
          if (!isSmall) return
          if (touchStartX.current === null || touchEndX.current === null) return
          const dx = touchEndX.current - touchStartX.current
          if (dx > SWIPE_THRESHOLD) {
            selectPrev()
          } else if (dx < -SWIPE_THRESHOLD) {
            selectNext()
          }
          touchStartX.current = null
          touchEndX.current = null
        }}
      >
        <div className={styles.inner}>
          {selected && contentReady ? (
            <div className={`${styles.content} ${visible ? styles.visible : styles.hidden}`} style={{ whiteSpace: 'pre-wrap' }}>
              {renderWithLinks(content)}
            </div>
          ) : selected && !contentReady ? (
            <div className={`${styles.placeholder} ${visible ? styles.visible : styles.hidden}`}>LOADING...</div>
          ) : (
            // Don't show the placeholder until we've initialized (i.e. assigned the first file).
            // This avoids a brief flash of "Select a file to view" while the first file is being selected.
            initialized ? (
              <div className={`${styles.placeholder} ${visible ? styles.visible : styles.hidden}`}>Select a file to view</div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
