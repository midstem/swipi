import { useEffect } from 'react'
import { Autoplay } from './types'
import { startAutoplay } from '../../helpers'

export const useAutoplay = ({
  autoplay,
  autoplaySpeed,
  slideIndex,
  nextImg,
  timeout
}: Autoplay) => {
  useEffect(() => {
    if (!autoplay) return

    clearTimeout(timeout.current)
    startAutoplay(autoplaySpeed, timeout, nextImg)

    const currentTimeout = timeout.current

    return () => clearTimeout(currentTimeout)
  }, [autoplaySpeed, autoplay, slideIndex, nextImg, timeout])
}
