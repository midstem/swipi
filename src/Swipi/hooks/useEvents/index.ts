import { useState } from 'react'
import { TouchEvents } from './types'
import { calculateSlideIndex } from '../../helpers'

export const useEvents = ({
  isButton,
  transform,
  slideWidth,
  startTransform,
  children,
  setAnimation,
  setTransform,
  setSlideIndex,
  checkSwipiCorner,
  checkAreaBeyondSwipi,
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

  const turnInitialPosition = (): void => {
    setAnimation(false)
    setTransform((prev) => (prev ? prev - startTransform : startTransform))
  }

  const onSwipe = (): void => {
    setTransform((prev) => Math.round(prev / slideWidth) * slideWidth)
  }

  const onStart = (X: number): void => {
    checkSwipiCorner() && turnInitialPosition()
    setStartX(X)
    setMouseDown(true)
  }

  const onMove = (X: number): void => {
    if (!mouseDown) return
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
    onStart: isButton ? onStart : () => {},
    onMove: isButton ? onMove : () => {},
    onEnd
  }
}
