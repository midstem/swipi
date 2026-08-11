import { startAutoplay, TimeoutRef } from '../../autoplay'

export type SetupAutoplayProps = {
  getAutoplay: () => boolean
  getAutoplaySpeed: () => number
  onTick: () => void
}

export type AutoplayApi = {
  restart: () => void
  destroy: () => void
}

export const setupAutoplay = ({
  getAutoplay,
  getAutoplaySpeed,
  onTick
}: SetupAutoplayProps): AutoplayApi => {
  const timeoutRef: TimeoutRef = { current: undefined }

  const clear = (): void => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }

  const restart = (): void => {
    clear()

    if (!getAutoplay()) return

    startAutoplay(getAutoplaySpeed(), timeoutRef, onTick)
  }

  return { restart, destroy: clear }
}
