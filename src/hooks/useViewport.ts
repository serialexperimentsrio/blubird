import { useEffect, useState } from 'react'

export function useViewport(portraitBp = 500, landscapeBp = 1270) {
  // Avoid rendering different markup between server and initial client render.
  // Start unmounted (same on server and client), render using a stable
  // default width, then update after mount based on window.innerWidth.
  const [mounted, setMounted] = useState(false)
  const [width, setWidth] = useState<number>(landscapeBp)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    // Schedule the initial mount and width update asynchronously to avoid
    // calling setState synchronously inside the effect (prevents cascading renders)
    const id = window.setTimeout(() => {
      setMounted(true)
      onResize()
    }, 0)

    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const w = mounted ? width : landscapeBp
  const isPortrait = w <= portraitBp
  const isSquarish = w > portraitBp && w < landscapeBp
  const isLandscape = w >= landscapeBp

  return { width: w, isPortrait, isSquarish, isLandscape }
}
