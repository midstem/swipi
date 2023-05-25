import { Navigation } from './types'

export const useNavigation = ({
  putInTheInitialPosition,
  checkSwipiCorner,
  setTransform,
  setAnimation,
  slideWidth,
  isDisableMove
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) => (callback: (transform: number) => void) => {
      if (isDisableMove(!!nextSlide)) return

      setTransform((transform) => {
        callback(transform)

        return nextSlide ? transform - slideWidth : transform + slideWidth
      })

      setAnimation(true)

      checkSwipiCorner() &&
        putInTheInitialPosition(() =>
          setTransform((transform) => {
            callback(transform)

            return nextSlide ? transform - slideWidth : transform + slideWidth
          })
        )
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
