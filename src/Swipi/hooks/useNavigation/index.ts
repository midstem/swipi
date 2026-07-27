import { Navigation } from './types'

export const useNavigation = ({
  setTransform,
  setAnimation,
  slideWidth,
  isDisableMove
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) => (callback: (transform: number) => void) => {
      if (isDisableMove(!!nextSlide)) return

      setAnimation(true)

      setTransform((transform) => {
        callback(transform)

        return nextSlide ? transform - slideWidth : transform + slideWidth
      })
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
