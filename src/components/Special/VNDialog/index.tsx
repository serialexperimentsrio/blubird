'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import styles from './style.module.css'

interface VNDialogProps {
  language: 'en' | 'ja'
  isFadingOut: boolean
  onComplete?: () => void
}

const dialogStrings = {
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

export default function VNDialog({ language, isFadingOut: parentFadingOut, onComplete }: VNDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showContinueIndicator, setShowContinueIndicator] = useState(false)
  const [shouldStopTyping, setShouldStopTyping] = useState(false)

  // Use refs for click debouncing to avoid state updates
  const isClickableRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const currentLanguageRef = useRef(language)

  // Initial delay before showing dialog
  useEffect(() => {
    const hasSeenDialog = sessionStorage.getItem('vn-dialog-seen')
    if (hasSeenDialog === 'true') {
      return
    }

    // Update language ref to current language
    currentLanguageRef.current = language

    // Check if we're resuming from a language toggle
    const isLanguageToggle = sessionStorage.getItem('language-toggling')
    const savedState = sessionStorage.getItem('vn-dialog-state')

    if (isLanguageToggle && savedState) {
      // Restore state from before language toggle
      const state = JSON.parse(savedState)
      setCurrentIndex(state.currentIndex)
      setIsTyping(state.isTyping)
      setShowContinueIndicator(state.showContinueIndicator)

      // Show immediately, no delay
      setIsMounted(true)
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsVisible(true)
        }, 10)
      })
    } else {
      // Normal initial mount with delay
      const mountTimer = setTimeout(() => {
        setIsMounted(true)
        // Small delay to allow DOM to render before triggering fade
        requestAnimationFrame(() => {
          setTimeout(() => {
            setIsVisible(true)
          }, 10)
        })
      }, 1500)

      return () => clearTimeout(mountTimer)
    }
  }, [language])

  // Save state when language changes (before unmount due to navigation)
  useEffect(() => {
    if (!isVisible) return

    // Save current state for restoration after language toggle navigation
    const state = {
      currentIndex,
      isTyping,
      showContinueIndicator
    }
    sessionStorage.setItem('vn-dialog-state', JSON.stringify(state))
  }, [currentIndex, isTyping, showContinueIndicator, isVisible])

  // Typewriter effect + pause support
  useEffect(() => {
    if (!isVisible || currentIndex >= dialogStrings[currentLanguageRef.current].length || shouldStopTyping) return

    const fullText = dialogStrings[currentLanguageRef.current][currentIndex]
    const textWithoutPauses = fullText.replace(/<pause>/g, '')

    // Respect reduced-motion preference: reveal text instantly
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsTyping(false)
      setShowContinueIndicator(true)
      setDisplayedText(textWithoutPauses)
      setShouldStopTyping(false)
      return
    }

    setIsTyping(true)
    setShowContinueIndicator(false)
    setDisplayedText('')
    setShouldStopTyping(false)

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
  }, [currentIndex, isVisible, shouldStopTyping])

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('vn-dialog-seen', 'true')
    setIsVisible(false)
    setTimeout(() => {
      onComplete?.()
    }, 600)
  }, [onComplete])

  const handleClick = useCallback(() => {
    if (!isClickableRef.current) return

    isClickableRef.current = false
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      isClickableRef.current = true
    }, 100)

    if (isTyping) {
      // Complete current text instantly by removing pause markers
      const fullText = dialogStrings[currentLanguageRef.current][currentIndex].replace(/<pause>/g, '')
      setShouldStopTyping(true)
      setDisplayedText(fullText)
      setIsTyping(false)
      setShowContinueIndicator(true)
    } else if (currentIndex < dialogStrings[currentLanguageRef.current].length - 1) {
      // Advance to next dialog
      setShouldStopTyping(false)
      setCurrentIndex(prev => prev + 1)
    } else {
      // Final dialog completed, exit
      handleComplete()
    }
  }, [isTyping, currentIndex, handleComplete])

  const handleDismiss = useCallback(() => {
    handleComplete()
  }, [handleComplete])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isVisible) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible, handleClick, handleDismiss])

  // Memoize className to avoid string concatenation on every render
  const containerClassName = useMemo(
    () => `${styles.container} ${isVisible ? styles.visible : ''}`,
    [isVisible]
  )

  const continueClassName = useMemo(
    () => `${styles.continueIndicator} ${showContinueIndicator ? styles.visible : ''}`,
    [showContinueIndicator]
  )

  if (!isMounted) {
    return null
  }

  return (
    <div className={`${containerClassName} ${parentFadingOut ? 'language-fade-out' : ''}`}>
      <div className={styles.dialogBox} onClick={handleClick}>
        <button
          className={styles.dismissButton}
          aria-label="Dismiss dialog"
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
        >
          ESC
        </button>

        <div className={styles.text}>
          {displayedText}
        </div>

        <div className={continueClassName}>
          ▸
        </div>
      </div>
    </div>
  )
}
