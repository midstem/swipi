import { Navigation } from './types'

export const useNavigation = ({
  setTransform,
  setAnimation,
  slideWidth,
  normalizeTransform,
  isDisableMove
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) => (callback: (transform: number) => void) => {
      if (isDisableMove(!!nextSlide)) return

      setAnimation(false)
      setTransform((prev) => normalizeTransform(prev))

      requestAnimationFrame(() => {
        setAnimation(true)
        setTransform((prev) => {
          callback(prev)

          return nextSlide ? prev - slideWidth : prev + slideWidth
        })
      })
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
