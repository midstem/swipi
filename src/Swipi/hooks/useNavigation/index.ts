import { Navigation } from './types'

export const useNavigation = ({
  putInTheInitialPosition,
  checkSwipiCorner,
  setTransform,
  setAnimation,
  slideWidth,
  children
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) =>
    (callback: (transform: number, children: JSX.Element[]) => void) => {
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
