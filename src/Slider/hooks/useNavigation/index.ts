import { Navigation } from 'src/Slider/hooks/useNavigation/types'

export const useNavigation = ({
  putInTheInitialPosition,
  checkSliderCorner,
  setTransform,
  setAnimation,
  slideWidth,
  children
}: Navigation) => {
  const navigateSlide =
    (nextSlide?: boolean) =>
    (callback: (prev: number, children: JSX.Element[]) => void) => {
      setTransform((prev) => {
        callback(prev, children)

        return nextSlide ? prev - slideWidth : prev + slideWidth
      })

      setAnimation(true)

      checkSliderCorner() &&
        putInTheInitialPosition(() =>
          setTransform((prev) => {
            callback(prev, children)

            return nextSlide ? prev - slideWidth : prev + slideWidth
          })
        )
    }

  return {
    nextImg: navigateSlide(true),
    prevImg: navigateSlide()
  }
}
