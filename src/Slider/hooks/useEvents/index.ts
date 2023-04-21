import { useState } from 'react'
import { TouchEvents } from './types'
import { calculateSlideIndex, getDragDirection } from '../../helpers'

export const useEvents = ({
  isButton,
  transform,
  slideWidth,
  startTransform,
  children,
  setAnimation,
  setTransform,
  setSlideIndex,
  checkSliderCorner,
  checkAreaBeyondSlider,
  jumpToTheLastSlide,
  moveSlides,
  setStartX,
  setEndX,
  setMovePath,
  isNavigationAllowed,
  endX,
  startX
}: TouchEvents) => {
  const [mouseDown, setMouseDown] = useState(false)

  const isDragAllowed = (end: number, start: number): boolean => {
    const dragDirection = getDragDirection(end, start)
    const isLeftDrag = dragDirection === 'left' && isNavigationAllowed(true)
    const isRightDrag = dragDirection === 'right' && isNavigationAllowed()

    return isLeftDrag || isRightDrag
  }

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
    setTransform((prev) => Math.round(prev / slideWidth) * slideWidth)
  }

  const onStart = (X: number): void => {
    checkSliderCorner() && turnInitialPosition()
    setStartX(X)
    setMouseDown(true)
  }

  const onMove = (X: number): void => {
    setEndX(X)

    if (mouseDown && isDragAllowed(endX, startX)) {
      setAnimation(false)
      moveSlides()
      setSlideIndex(calculateSlideIndex(transform, slideWidth, children))
    }
  }

  const onEnd = (): void => {
    setAnimation(true)
    onSwipe()
    checkAreaBeyondSlider() && jumpToTheLastSlide()
    resetCoordinates()
    setMouseDown(false)
  }

  return {
    onStart: isButton ? onStart : () => {},
    onMove: isButton ? onMove : () => {},
    onEnd
  }
}
