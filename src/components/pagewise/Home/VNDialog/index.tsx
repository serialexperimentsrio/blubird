'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Lang } from '@/lib/lang'
import styles from './style.module.css'

const dialogStrings: Record<Lang, string[]> = {
  en: [
    "HELLO USER.<pause> THIS IS RIO,<pause> AND WELCOME TO MY HUMBLE ABODE.",
    "I'D OFFER YOU TEA,<pause> BUT THIS IS<pause> A DIGITAL INTERFACE.",
    "AND IN THIS FORM,<pause> I'M JUST A TEXT BOX.<pause> I DON'T EVEN HAVE HANDS.",
    "ALL I CAN DO IS TALK,<pause> ONE LINE AT A TIME.",
    "AND ALL YOU CAN DO IS INTERACT.",
    "SO FEEL FREE TO LOOK AROUND<pause> AND MAKE YOURSELF AT HOME.",
    "IF I'M IN THE WAY,<pause> JUST PRESS ESC.<pause> I WON'T TAKE IT PERSONALLY.",
    "I HAVE NOTHING MORE TO SAY.",
    ".<pause>.<pause>.",
    "YES?",
    "OH,<pause> YOU WANT TO SEE A MAGIC TRICK?",
    "I CAN MAKE MYSELF DISAPPEAR.",
    "READY?",
    // Last line: the box switches off by itself once it's typed out
    "3,<pause><pause> 2,<pause><pause> 1."
  ],
  ja: [
    "こんにちは、<pause>ユーザーさん。<pause>理央です。<pause>狭いところだけど、<pause>ようこそ。",
    "お茶でも出したいところだけど、<pause>ここは<pause>デジタルインターフェースだからね。",
    "それに、<pause>この姿じゃただのテキストボックス。<pause>手すらないんだよね。",
    "私にできるのは、<pause>一行ずつ話すことだけ。",
    "・<pause>・<pause>・",
    "あなたにできるのは、<pause>操作することだけ。",
    "だから、<pause>好きに見て回って<pause>ゆっくりしていってね。",
    "邪魔だったら、<pause>ESCを押してね。<pause>気にしないから。",
    "今のところ、<pause>話せるのはこれくらいかな。",
    "・<pause>・<pause>・",
    "まだ何か？",
    "あ、<pause>手品が見たいの？",
    "自分が消える手品、<pause>できるんだよ。",
    "準備はいい？",
    "3、<pause><pause>2、<pause><pause>1。"
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
  const containerRef = useRef<HTMLDivElement>(null)
  const vanishingRef = useRef(false)
  const beamRef = useRef<HTMLDivElement | null>(null)
  const isLastLine = currentIndex === lines.length - 1

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

  // The magic trick ending: the box switches off like a CRT TV.
  // 1. The picture flares, then collapses vertically into a white line.
  // 2. The line pulls in to a glowing dot in the middle.
  // 3. The dot hangs for a moment, then fades out like phosphor afterglow.
  const vanish = useCallback(() => {
    if (vanishingRef.current) return
    vanishingRef.current = true
    progress.seen = true
    const hide = () => {
      setIsVisible(false)
      setIsMounted(false)
    }
    const el = containerRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hide()
      return
    }

    // Measure before the box starts shrinking
    const rect = el.getBoundingClientRect()
    const center = 'translateX(-50%)' // the container's own centring, kept in every frame
    const collapse = el.animate(
      [
        { transform: `${center} scale(1, 1)`, filter: 'brightness(1)' },
        { transform: `${center} scale(1, 1)`, filter: 'brightness(1.8)', offset: 0.25 },
        // saturate(0) + brightness turns the blue box white as it thins out
        { transform: `${center} scale(1, 0.015)`, filter: 'saturate(0) brightness(6)' },
      ],
      { duration: 220, easing: 'cubic-bezier(0.55, 0, 1, 0.45)', fill: 'forwards' }
    )

    collapse.onfinish = () => {
      el.style.visibility = 'hidden'
      // The line and dot live outside the box, so its scaling doesn't squash their glow
      const beam = document.createElement('div')
      Object.assign(beam.style, {
        position: 'fixed',
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '999px',
        background: '#fff',
        zIndex: '1000',
        pointerEvents: 'none',
      })
      document.body.append(beam)
      beamRef.current = beam

      const glow = (size: number, alpha: number) =>
        `0 0 ${size}px ${size / 3}px rgba(255, 255, 255, ${alpha}), 0 0 ${size * 3}px ${size}px rgba(160, 180, 255, ${alpha * 0.7})`
      beam.animate(
        [
          { width: `${rect.width}px`, height: '2px', boxShadow: glow(6, 1), easing: 'cubic-bezier(0.7, 0, 1, 1)' },
          { width: '5px', height: '5px', boxShadow: glow(8, 1), offset: 0.35 },
          { width: '5px', height: '5px', boxShadow: glow(8, 1), offset: 0.55, easing: 'ease-out' },
          { width: '0px', height: '0px', boxShadow: glow(2, 0), opacity: 0 },
        ],
        { duration: 650, fill: 'forwards' }
      ).onfinish = () => {
        beam.remove()
        hide()
      }
    }
  }, [])

  // Don't leave the dot behind if the page changes mid-trick
  useEffect(() => () => beamRef.current?.remove(), [])

  // Once the countdown has typed out, vanish without waiting for a click
  useEffect(() => {
    if (!isVisible || !isLastLine || !showContinueIndicator) return
    const id = setTimeout(vanish, 500)
    return () => clearTimeout(id)
  }, [isVisible, isLastLine, showContinueIndicator, vanish])

  const handleComplete = useCallback(() => {
    if (vanishingRef.current) return
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
      // Clicked through the countdown: do the trick now
      vanish()
    }
  }, [lines, isTyping, currentIndex, vanish])

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
    <div ref={containerRef} className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
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

        <div className={`${styles.continueIndicator} ${showContinueIndicator && !isLastLine ? styles.visible : ''}`} aria-hidden="true">
          ▸
        </div>
      </div>
    </div>
  )
}
