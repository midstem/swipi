import { TouchEvents } from 'src/Slider/hooks/useTouch/types'
import { calculateSlideIndex } from 'src/Slider/helpers'
import { useState } from 'react'

export const useTouch = ({
  isButton,
  transform,
  slideWidth,
  startTransform,
  children,
  setAnimation,
  setTransform,
  setSlideIndex,
  checkSliderCorner,
  checkAreaWithoutSlides,
  jumpToTheLastSlide,
  moveSlides,
  setStartX,
  setEndX,
  setMovePath
}: TouchEvents) => {
  const [mouseDown, setMouseDown] = useState(false)

  const resetCoordinates = (): void => {
    setEndX(0)
    setMovePath(0)
    setStartX(0)
  }

  const turnInitialPositionByTouched = (): void => {
    setAnimation(false)
    setTransform((prev) => (prev ? prev - startTransform : startTransform))
  }

  const onSwipe = (): void => {
    setTransform((prev) => Math.round(prev / slideWidth) * slideWidth)
  }

  const startTouchByScreen = (X: number): void => {
    checkSliderCorner() && turnInitialPositionByTouched()
    setStartX(X)
    setMouseDown(true)
  }

  const moveTouchScreen = (X: number): void => {
    if (!mouseDown) return
    setAnimation(false)
    moveSlides()
    setEndX(X)
    setSlideIndex(calculateSlideIndex(transform, slideWidth, children))
  }

  const endTouchScreen = (): void => {
    setAnimation(true)
    onSwipe()
    checkAreaWithoutSlides() && jumpToTheLastSlide()
    resetCoordinates()
    setMouseDown(false)
  }

  return {
    startTouchByScreen: isButton ? startTouchByScreen : () => {},
    moveTouchScreen: isButton ? moveTouchScreen : () => {},
    endTouchScreen
  }
}
