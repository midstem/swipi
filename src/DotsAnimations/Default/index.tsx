import type { JSX } from 'react'
import { useCallback } from 'react'
import Dot from '../../UI/Dot'
import DotButton from '../../UI/DotButton'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'
import { hasCustomDots, renderCustomDot } from './helpers'

const Default = ({
  slideIndex,
  appearance,
  handleDotClick,
  countShowDots
}: DotsTypes): JSX.Element => {
  const renderDot = useCallback(
    (_index: number, isActive: boolean) => {
      if (hasCustomDots(appearance)) {
        return renderCustomDot(isActive, appearance)
      }

      return (
        <Dot
          isActive={isActive}
          dotColor={appearance.dotColor}
          activeDotColor={appearance.activeDotColor}
          sizeForDefaultDot={appearance.sizeForDefaultDot}
          sizeForDefaultActiveDot={appearance.sizeForDefaultActiveDot}
        />
      )
    },
    [appearance]
  )

  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <DotButton
          key={index}
          index={index}
          isActive={slideIndex === index}
          onSelect={handleDotClick}
          renderDot={renderDot}
        />
      ))}
    </DotsWrapper>
  )
}

export default Default
