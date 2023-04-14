import { useEffect } from 'react'
import { startAutoplay } from 'src/Slider/helpers'
import { Autoplay } from 'src/Slider/hooks/useAutoplay/types'

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
