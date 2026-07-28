import { useEffect, useRef } from 'react'
import { Autoplay } from './types'
import { startAutoplay } from '../../helpers'

export const useAutoplay = ({
  autoplay,
  autoplaySpeed,
  slideIndex,
  nextImg,
  timeout
}: Autoplay) => {
  const nextImgRef = useRef(nextImg)

  nextImgRef.current = nextImg

  useEffect(() => {
    if (!autoplay) return

    clearTimeout(timeout.current)
    startAutoplay(autoplaySpeed, timeout, () => nextImgRef.current())

    const currentTimeout = timeout.current

    return () => clearTimeout(currentTimeout)
  }, [autoplaySpeed, autoplay, slideIndex, timeout])
}
