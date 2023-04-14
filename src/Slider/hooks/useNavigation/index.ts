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
    (
      callback: (prev: number, children: JSX.Element[]) => void,
      nexSlide?: boolean
    ) =>
    () => {
      setTransform((prev) => {
        callback(prev, children)

        return nexSlide ? prev - slideWidth : prev + slideWidth
      })

      setAnimation(true)

      checkSliderCorner() &&
        putInTheInitialPosition(() =>
          setTransform((prev) => {
            callback(prev, children)

            return nexSlide ? prev - slideWidth : prev + slideWidth
          })
        )
    }

  return { navigateSlide }
}
