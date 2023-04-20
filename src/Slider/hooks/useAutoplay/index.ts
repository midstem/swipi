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

    return clearTimeout(timeout.current)
  }, [autoplaySpeed, autoplay, slideIndex, nextImg, timeout])
}
