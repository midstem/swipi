import { ReactNode, useCallback } from 'react'
import { DotsProps, UseDotsReturn } from './types'
import ActiveDot from '../../../UI/ActiveDot'
import Dot from '../../../UI/Dot'
import { returnCountOfDots } from '../../helpers'

export const useDots = ({
  isLoop,
  dotColor,
  customDot,
  slidesCount,
  activeDotColor,
  customActiveDot,
  visibleCountSlides
}: DotsProps): UseDotsReturn => {
  const returnDots = useCallback(
    (_index: number, isActive: boolean): ReactNode => {
      if (isActive) {
        return customActiveDot || <ActiveDot activeDotColor={activeDotColor} />
      }

      return customDot || <Dot dotColor={dotColor} />
    },
    [customActiveDot, activeDotColor, customDot, dotColor]
  )

  return {
    returnDots,
    countShowDots: returnCountOfDots(slidesCount, visibleCountSlides, isLoop)
  }
}
