import { useRef } from 'react'
import { Navigation } from './types'

export const useNavigation = ({
  setTransform,
  setAnimation,
  slideWidth,
  animationSpeed,
  isLoopEnabled,
  isDisableMove
}: Navigation) => {
  const isAnimating = useRef(false)

  const navigateSlide =
    (nextSlide?: boolean) => (callback: (transform: number) => void) => {
      if (isDisableMove(!!nextSlide)) return
      if (isLoopEnabled && isAnimating.current) return

      setAnimation(true)
      setTransform((transform) => {
        callback(transform)

        return nextSlide ? transform - slideWidth : transform + slideWidth
      })

      if (!isLoopEnabled) return

      isAnimating.current = true
      setTimeout(() => {
        isAnimating.current = false
      }, animationSpeed)
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
