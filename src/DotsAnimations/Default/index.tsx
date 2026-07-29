import type { JSX } from 'react'
import { useCallback } from 'react'
import Dot from '../../UI/Dot'
import DotButton from '../../UI/DotButton'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'

const Default = ({
  slideIndex,
  appearance,
  handleDotClick,
  returnDots,
  countShowDots
}: DotsTypes): JSX.Element => {
  const renderDot = useCallback(
    (index: number, isActive: boolean) => {
      const {
        dotColor,
        customDot,
        activeDotColor,
        customActiveDot,
        sizeForDefaultDot,
        sizeForDefaultActiveDot
      } = appearance

      if (customDot || customActiveDot) return returnDots(index, isActive)

      return (
        <Dot
          isActive={isActive}
          dotColor={dotColor}
          activeDotColor={activeDotColor}
          sizeForDefaultDot={sizeForDefaultDot}
          sizeForDefaultActiveDot={sizeForDefaultActiveDot}
        />
      )
    },
    [appearance, returnDots]
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
