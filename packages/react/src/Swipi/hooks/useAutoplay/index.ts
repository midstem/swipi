import { useEffect } from 'react'
import { Autoplay } from './types'
import { startAutoplay } from '@swipi/core'
import { useLatestRef } from '../useLatestRef'

export const useAutoplay = ({
  autoplay,
  autoplaySpeed,
  slideIndex,
  nextImg,
  timeout
}: Autoplay) => {
  const nextImgRef = useLatestRef(nextImg)

  useEffect(() => {
    if (!autoplay) return

    clearTimeout(timeout.current)
    startAutoplay(autoplaySpeed, timeout, () => nextImgRef.current())

    const currentTimeout = timeout.current

    return () => clearTimeout(currentTimeout)
  }, [autoplaySpeed, autoplay, slideIndex, timeout, nextImgRef])
}
