import { useState } from 'react'
import { TouchEvents } from './types'
import {
  calculateSlideIndex,
  calculateSliderTransform,
  getSwipeDirection
} from '../../helpers'
import { SwipeDirections } from '../../constants'

export const useEvents = ({
  endX: touchEndX,
  startX: touchStartX,
  children,
  transform,
  slideWidth,
  isShowArrows,
  startTransform,
  setEndX,
  setStartX,
  moveSlides,
  setMovePath,
  setAnimation,
  setTransform,
  setSlideIndex,
  checkSwipiCorner,
  jumpToTheLastSlide,
  checkAreaBeyondSwipi,
  isDisableMove
}: TouchEvents) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [timeTouch, setTimeTouch] = useState<Date>(new Date())

  const resetCoordinates = (): void => {
    setEndX(0)
    setMovePath(0)
    setStartX(0)
  }

  const turnInitialPosition = (): void => {
    setAnimation(false)
    setTransform((prev) => (prev ? prev - startTransform : startTransform))
  }

  const onSwipe = (): void => {
    const swipedSide = getSwipeDirection({ touchEndX, touchStartX })

    setTransform((prev) => {
      const newTransform = calculateSliderTransform({
        transform: prev,
        isDisableMove: isDisableMove(swipedSide === SwipeDirections.LEFT),
        slideWidth,
        timeTouch,
        swipedSide
      })

      setSlideIndex(calculateSlideIndex(newTransform, slideWidth, children))

      return newTransform
    })
  }

  const onStart = (X: number): void => {
    setTimeTouch(new Date())
    checkSwipiCorner() && turnInitialPosition()
    setStartX(X)
    setMouseDown(true)
  }

  const onMove = (X: number): void => {
    if (!mouseDown) return

    const swipedSide = getSwipeDirection({ touchEndX: X, touchStartX })

    if (isDisableMove(swipedSide === SwipeDirections.LEFT)) return

    setAnimation(false)
    moveSlides()
    setEndX(X)
    setSlideIndex(calculateSlideIndex(transform, slideWidth, children))
  }

  const onEnd = (): void => {
    setAnimation(true)
    onSwipe()
    checkAreaBeyondSwipi() && jumpToTheLastSlide()
    resetCoordinates()
    setMouseDown(false)
  }

  return {
    onStart: isShowArrows ? onStart : () => {},
    onMove: isShowArrows ? onMove : () => {},
    onEnd
  }
}
