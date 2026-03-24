"use client"

import React, { useEffect, useState, useRef } from 'react'
import styles from './style.module.css'
import { useBreakpoint } from '@/hooks/useBreakpoint'

type Props = {
  entries: string[] | null
  lang: string
  initialEntry?: string | null
  initialContent?: string | null
}

const MD_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/
const URL_RE = /(https?:\/\/[^\s]+)/

export default function Diary({ entries, lang, initialEntry, initialContent }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(initialEntry ?? null)
  const [content, setContent] = useState<string>(initialContent ?? '')
  const [contentReady, setContentReady] = useState<boolean>(initialContent ? true : false)
  const [visible, setVisible] = useState<boolean>(false)
  const FADE_MS = 200
  const prevSelected = useRef<string | null>(null)
  // Enable transitions after mount (so initial appearance is immediate, then tab switches animate)
  const [withTransitions, setWithTransitions] = useState<boolean>(false)
  const [isSwitching, setIsSwitching] = useState<boolean>(false)
  // `selectedEntry` drives which file we fetch. `visualEntry` controls which tab
  // shows the active styling so we can delay the visual change until after
  // the synchronized transition completes.
  const [visualEntry, setVisualEntry] = useState<string | null>(initialEntry ?? null)
  const [initialized, setInitialized] = useState<boolean>(initialEntry ? true : false)

  // Parse text and convert Markdown links [text](url) and plain URLs into React nodes.
  function renderWithLinks(text: string) {
    const nodes: React.ReactNode[] = []
    let idx = 0
    const mdLink = new RegExp(MD_LINK_RE.source, 'g')
    const urlRe = new RegExp(URL_RE.source, 'g')

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
      // Do not reveal yet — wait for `entries` to finish loading so the
      // tab list is present and can animate together with the panel.
      }))
      return () => cancelAnimationFrame(raf)
  }, [])

  const isLoading = entries === null
  const displayEntries = (entries || []).filter((entry) => !entry.startsWith('.'))

  const { isSmall } = useBreakpoint(500, 1270)

  // Touch swipe handling for mobile: detect horizontal swipes on the panel
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const SWIPE_THRESHOLD = 50

  const selectPrev = () => {
    if (!selectedEntry) return
    const i = displayEntries.indexOf(selectedEntry)
    if (i < displayEntries.length - 1) {
      setVisualEntry(displayEntries[i + 1])
      requestAnimationFrame(() => setSelectedEntry(displayEntries[i + 1]))
    }
  }

  const selectNext = () => {
    if (!selectedEntry) return
    const i = displayEntries.indexOf(selectedEntry)
    if (i > 0) {
      setVisualEntry(displayEntries[i - 1])
      requestAnimationFrame(() => setSelectedEntry(displayEntries[i - 1]))
    }
  }

  // Reveal only after transitions are enabled and entries have finished loading
  useEffect(() => {
    if (!withTransitions) return
    if (!isLoading) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(raf)
    }
  }, [withTransitions, isLoading])

  useEffect(() => {
    if (!selectedEntry) return
    let cancelled = false

    const fetchEntry = async () => {
      // Mark content not-ready until this fetch completes to avoid showing
      // stale/duplicate text while a new fetch is in-flight.
      setContentReady(false)
      try {
        const url = `/diary/${encodeURIComponent(lang)}/${encodeURIComponent(selectedEntry)}`
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
      fetchEntry()
      prevSelected.current = selectedEntry
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
    fetchEntry()

    prevSelected.current = selectedEntry
    return () => {
      cancelled = true
    }
  // `withTransitions` is intentionally omitted to avoid changing the
  // dependency array size between HMR updates. The fetch depends on
  // `selectedEntry` and `lang` only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntry, lang])

  useEffect(() => {
    if (displayEntries && displayEntries.length && !selectedEntry) {
      // Set visual entry first so the tab can paint, then start the
      // content fetch on the next animation frame. This ensures the tab
      // button appears before the panel content loads, avoiding a snap.
      const first = displayEntries[0]
      setVisualEntry(first)
      requestAnimationFrame(() => setSelectedEntry(first))
      setInitialized(true)
    }
  }, [displayEntries, selectedEntry])

  return (
    <div className={`${styles.container} ${isSmall ? styles.isSmall : ''} ${withTransitions ? styles.withTransitions : ''} ${isSwitching ? styles.switching : ''}`}>
      <div className={`${styles.list} ${visible ? styles.visible : styles.hidden}`}>
        {displayEntries.length === 0 ? (
          // If entries are still loading, don't show the empty placeholder —
          // wait until the parent has finished fetching to avoid a flash.
          isLoading ? null : (
            <div className={styles.empty}>No entries found</div>
          )
        ) : (
          displayEntries.map((entry) => {
          const label = entry.replace(/\.[^/.]+$/, '')
          return (
            <button
              key={entry}
              className={`${styles.card} ${visualEntry === entry ? styles.active : ''} ${visible ? styles.visible : styles.hidden}`}
              onClick={() => {
                if (selectedEntry === entry) return
                // Paint the visual active state first, then set `selectedEntry`
                // on the next frame to allow the button to render before
                // the fetch and panel update begin.
                setVisualEntry(entry)
                requestAnimationFrame(() => setSelectedEntry(entry))
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
          {selectedEntry && contentReady ? (
            <div className={`${styles.content} ${visible ? styles.visible : styles.hidden}`} style={{ whiteSpace: 'pre-wrap' }}>
              {renderWithLinks(content)}
            </div>
          ) : selectedEntry && !contentReady ? (
            <div className={`${styles.placeholder} ${visible ? styles.visible : styles.hidden}`}>LOADING...</div>
          ) : (
            // Don't show the placeholder until we've initialized (i.e. assigned the first entry).
            // This avoids a brief flash of "Select an entry to view" while the first entry is being selected.
            initialized ? (
              <div className={`${styles.placeholder} ${visible ? styles.visible : styles.hidden}`}>Select an entry to view</div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
