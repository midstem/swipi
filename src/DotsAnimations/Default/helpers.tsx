import type { JSX } from 'react'
import ActiveDot from '../../UI/ActiveDot'
import Dot from '../../UI/Dot'
import { DotsAppearance } from '../../types'

export const hasCustomDots = ({
  customDot,
  customActiveDot
}: DotsAppearance): boolean => Boolean(customDot || customActiveDot)

export const renderCustomDot = (
  isActive: boolean,
  { customDot, customActiveDot, dotColor, activeDotColor }: DotsAppearance
): JSX.Element => {
  if (isActive) {
    return customActiveDot ?? <ActiveDot activeDotColor={activeDotColor} />
  }

  return customDot ?? <Dot dotColor={dotColor} />
}
