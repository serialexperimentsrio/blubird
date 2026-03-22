import { useEffect, useState } from 'react'

export function useBreakpoint(narrowBp = 500, wideBp = 1270) {
  // Avoid rendering different markup between server and initial client render.
  // Start unmounted (same on server and client), render using a stable
  // default width, then update after mount based on window.innerWidth.
  const [mounted, setMounted] = useState(false)
  const [width, setWidth] = useState<number>(wideBp)

  useEffect(() => {
    let debounceId: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(debounceId)
      debounceId = setTimeout(() => setWidth(window.innerWidth), 100)
    }
    // Schedule the initial mount and width update asynchronously to avoid
    // calling setState synchronously inside the effect (prevents cascading renders)
    const id = window.setTimeout(() => {
      setMounted(true)
      setWidth(window.innerWidth)
    }, 0)

    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(id)
      clearTimeout(debounceId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const w = mounted ? width : wideBp
  const isNarrow = w <= narrowBp
  const isMedium = w > narrowBp && w < wideBp
  const isWide = w >= wideBp
  const isSmall = isNarrow || isMedium

  return { width: w, isNarrow, isMedium, isWide, isSmall }
}
