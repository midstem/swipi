import { TimeoutRef } from './types'

export * from './types'

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: TimeoutRef,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    if (typeof document !== 'undefined' && document.hidden) {
      startAutoplay(autoplaySpeed, timeout, nextImg)
      return
    }

    nextImg()
  }, autoplaySpeed)
}
