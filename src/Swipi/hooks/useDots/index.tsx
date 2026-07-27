import { ReactNode, useState, useCallback } from 'react'
import { DotsProps } from './types'
import ActiveDot from '../../../UI/ActiveDot'
import Dot from '../../../UI/Dot'
import { calculateSlideIndex, returnCountOfDots } from '../../helpers'

export const useDots = ({
  setTransform,
  slideWidth,
  cloneCount,
  customActiveDot,
  customDot,
  setAnimation,
  activeDotColor,
  dotColor,
  loop,
  children,
  visibleCountSlides
}: DotsProps) => {
  const [slideIndex, setSlideIndex] = useState(0)

  const handleDotClick = (index: number): void => {
    setAnimation(true)
    setTransform(-(cloneCount + index) * slideWidth)
    setSlideIndex(index)
  }

  const returnDots = (index: number): ReactNode => {
    if (slideIndex === index) {
      return customActiveDot || <ActiveDot activeDotColor={activeDotColor} />
    }

    return (
      customDot || (
        <Dot index={index} slideIndex={slideIndex} dotColor={dotColor} />
      )
    )
  }

  const changeDot = useCallback(
    (next?: boolean) => (transform: number) => {
      setSlideIndex(
        calculateSlideIndex(
          next ? transform - slideWidth : transform + slideWidth,
          slideWidth,
          children,
          cloneCount
        )
      )
    },
    [slideWidth, children, cloneCount]
  )

  return {
    handleDotClick,
    returnDots,
    slideIndex,
    setSlideIndex,
    nextDot: changeDot(true),
    prevDot: changeDot(),
    countShowDots: returnCountOfDots(children, visibleCountSlides, loop)
  }
}
