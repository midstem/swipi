import { REDUCED_MOTION_QUERY } from '../index'

export const setupPrefersReducedMotion = (
  onChange: (prefersReducedMotion: boolean) => void
): (() => void) => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return () => {}
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)

  const handleChange = (event: MediaQueryListEvent): void => {
    onChange(event.matches)
  }

  // Initial read
  onChange(mediaQuery.matches)

  mediaQuery.addEventListener('change', handleChange)

  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}
