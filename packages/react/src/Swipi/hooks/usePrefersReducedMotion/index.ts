import { useEffect, useState } from 'react'
import { REDUCED_MOTION_QUERY } from '../../constants'

export const usePrefersReducedMotion = (enabled: boolean): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (!enabled || typeof window.matchMedia !== 'function') {
      setPrefersReducedMotion(false)
      return
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const handleChange = (event: MediaQueryListEvent): void =>
      setPrefersReducedMotion(event.matches)

    setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enabled])

  return prefersReducedMotion
}
