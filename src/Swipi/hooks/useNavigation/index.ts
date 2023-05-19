import { Navigation } from './types'

export const useNavigation = ({
  putInTheInitialPosition,
  checkSwipiCorner,
  setTransform,
  setAnimation,
  slideWidth,
  children,
  isDisableMove
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) =>
    (callback: (transform: number, children: JSX.Element[]) => void) => {
      if (isDisableMove(!!nextSlide)) return

      setTransform((transform) => {
        callback(transform, children)

        return nextSlide ? transform - slideWidth : transform + slideWidth
      })

      setAnimation(true)

      checkSwipiCorner() &&
        putInTheInitialPosition(() =>
          setTransform((transform) => {
            callback(transform, children)

            return nextSlide ? transform - slideWidth : transform + slideWidth
          })
        )
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
