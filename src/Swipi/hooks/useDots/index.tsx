import { ReactNode } from 'react'
import { DotsProps, UseDotsReturn } from './types'
import ActiveDot from '../../../UI/ActiveDot'
import Dot from '../../../UI/Dot'
import { returnCountOfDots } from '../../helpers'

export const useDots = ({
  isLoop,
  dotColor,
  customDot,
  slideIndex,
  slidesCount,
  activeDotColor,
  customActiveDot,
  visibleCountSlides
}: DotsProps): UseDotsReturn => {
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

  return {
    returnDots,
    countShowDots: returnCountOfDots(slidesCount, visibleCountSlides, isLoop)
  }
}
