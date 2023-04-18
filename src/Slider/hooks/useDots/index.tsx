import { ReactNode, useState, useCallback } from 'react'
import { DotsProps } from 'src/Slider/hooks/useDots/types'
import { calculateSlideIndex } from 'src/Slider/helpers'
import ActiveDot from 'src/UI/ActiveDot'
import Dot from 'src/UI/Dot'

export const useDots = ({
  setTransform,
  slideWidth,
  customActiveDot,
  customDot,
  setAnimation,
  activeDotColor,
  dotColor
}: DotsProps) => {
  const [slideIndex, setSlideIndex] = useState(0)

  const handleDotClick = (index: number): void => {
    setAnimation(true)
    setTransform(-index * slideWidth)
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
    (next?: boolean) => (transform: number, children: JSX.Element[]) => {
      setSlideIndex(
        calculateSlideIndex(
          next ? transform + slideWidth : transform - slideWidth,
          slideWidth,
          children
        )
      )
    },
    [slideWidth]
  )

  return {
    handleDotClick,
    returnDots,
    slideIndex,
    setSlideIndex,
    nextDot: changeDot(true),
    prevDot: changeDot()
  }
}
