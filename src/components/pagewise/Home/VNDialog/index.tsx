'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'

const dialogStrings: Record<Lang, string[]> = {
  en: [
    "I THOUGHT ABOUT<pause> WHAT TO SAY HERE.",
    ".<pause>.<pause>.",
    "NOTHING CAME TO MIND.",
    "BUT YOU'RE HERE ANYWAY.",
    ".<pause>.<pause>.",
    "MAYBE LET THIS SKY<pause> TAKE IT FROM HERE."
  ],
  ja: [
    "ここで<pause>何を言おうか<pause>考えてみた。",
    "・<pause>・<pause>・",
    "何も浮かばなかった。",
    "でも、<pause>あなたはここにいる。",
    "・<pause>・<pause>・",
    "あとは<pause>この空に<pause>お任せします。"
  ]
}

// Module state survives client-side navigation and language toggles, and
// resets on a full page load, so the dialog plays once per visit and resumes
// where it left off when the user comes back to it.
const progress = { started: false, seen: false, index: 0 }

export default function VNDialog({ lang }: { lang: Lang }) {
  const lines = dialogStrings[lang]
  const [currentIndex, setCurrentIndex] = useState(progress.index)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showContinueIndicator, setShowContinueIndicator] = useState(false)
  const [shouldStopTyping, setShouldStopTyping] = useState(false)

  // Use refs for click debouncing to avoid state updates
  const isClickableRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Show after a delay on first view, immediately when resuming
  useEffect(() => {
    if (progress.seen) return

    const mountTimer = setTimeout(() => {
      progress.started = true
      setIsMounted(true)
      // Small delay to allow DOM to render before triggering fade
      requestAnimationFrame(() => {
        setTimeout(() => setIsVisible(true), 10)
      })
    }, progress.started ? 0 : 1500)

    return () => clearTimeout(mountTimer)
  }, [])

  useEffect(() => {
    progress.index = currentIndex
  }, [currentIndex])

  // Typewriter effect + pause support
  useEffect(() => {
    if (!isVisible || currentIndex >= lines.length || shouldStopTyping) return

    const fullText = lines[currentIndex]
    const textWithoutPauses = fullText.replace(/<pause>/g, '')

    // Respect reduced-motion preference: reveal text instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsTyping(false)
      setShowContinueIndicator(true)
      setDisplayedText(textWithoutPauses)
      return
    }

    setIsTyping(true)
    setShowContinueIndicator(false)
    setDisplayedText('')

    let timeoutId: NodeJS.Timeout
    let sourcePosition = 0 // Position in original text with <pause> markers
    let displayPosition = 0 // Position in text without markers
    let isCancelled = false

    const typeNextChar = () => {
      if (isCancelled || sourcePosition >= fullText.length) {
        if (!isCancelled) {
          setIsTyping(false)
          setShowContinueIndicator(true)
        }
        return
      }

      // Check if we're at a pause marker
      if (fullText.slice(sourcePosition, sourcePosition + 7) === '<pause>') {
        sourcePosition += 7 // Skip the pause marker in source
        timeoutId = setTimeout(typeNextChar, 400) // 400ms pause
        return
      }

      // Type the current character
      setDisplayedText(textWithoutPauses.slice(0, displayPosition + 1))
      sourcePosition++
      displayPosition++

      timeoutId = setTimeout(typeNextChar, 40) // 40ms per character
    }

    typeNextChar()

    return () => {
      isCancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [lines, currentIndex, isVisible, shouldStopTyping])

  const handleComplete = useCallback(() => {
    progress.seen = true
    setIsVisible(false)
    setTimeout(() => setIsMounted(false), 600)
  }, [])

  const handleClick = useCallback(() => {
    if (!isClickableRef.current) return

    isClickableRef.current = false
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      isClickableRef.current = true
    }, 100)

    if (isTyping) {
      // Complete current text instantly by removing pause markers
      setShouldStopTyping(true)
      setDisplayedText(lines[currentIndex].replace(/<pause>/g, ''))
      setIsTyping(false)
      setShowContinueIndicator(true)
    } else if (currentIndex < lines.length - 1) {
      // Advance to next dialog
      setShouldStopTyping(false)
      setCurrentIndex(prev => prev + 1)
    } else {
      // Final dialog completed, exit
      handleComplete()
    }
  }, [lines, isTyping, currentIndex, handleComplete])

  // Document-level click: advance dialog when clicking the content area.
  // Clicks on the header, footer and any link or button keep their own behavior.
  useEffect(() => {
    if (!isVisible) return

    const handleDocClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('header, footer, a, button')) return
      handleClick()
    }

    document.addEventListener('click', handleDocClick)
    return () => document.removeEventListener('click', handleDocClick)
  }, [isVisible, handleClick])

  // Keyboard support
  useEffect(() => {
    if (!isVisible) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleComplete()
        return
      }
      // Leave Enter/Space alone while a control has focus
      if ((e.target as Element).closest('a, button, input, textarea, select, [contenteditable]')) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible, handleClick, handleComplete])

  if (!isMounted) {
    return null
  }

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <button
        className={styles.dismissButton}
        aria-label={lang === 'ja' ? 'ダイアログを閉じる' : 'Dismiss dialog'}
        onClick={handleComplete}
      >
        ESC
      </button>
      <div className={styles.dialogBox}>
        <div className={styles.text}>
          {displayedText}
        </div>

        <div className={`${styles.continueIndicator} ${showContinueIndicator ? styles.visible : ''}`} aria-hidden="true">
          ▸
        </div>
      </div>
    </div>
  )
}
