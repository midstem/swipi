import type { JSX } from 'react'
import { useCallback, useMemo } from 'react'
import ActiveDot from '../../UI/ActiveDot'
import Dot from '../../UI/Dot'
import DotButton from '../../UI/DotButton'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'
import { getDotStyles } from './helpers'
import useSliding from './useSliding'

const Sliding = ({
  slideIndex,
  appearance,
  countShowDots,
  animationSpeed,
  handleDotClick
}: DotsTypes): JSX.Element => {
  const { customDot, customActiveDot, activeDotColor } = appearance

  const { dotsRef, activeDotRef, activeDotLeft } = useSliding({
    slideIndex,
    countShowDots
  })

  const [activeDotStyle, idleDotStyle] = useMemo(
    () => getDotStyles(animationSpeed),
    [animationSpeed]
  )

  const renderDot = useCallback(
    () =>
      customDot ?? (
        <Dot
          dotColor={appearance.dotColor}
          sizeForDefaultDot={appearance.sizeForDefaultDot}
        />
      ),
    [appearance, customDot]
  )

  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <DotButton
          key={index}
          index={index}
          isActive={slideIndex === index}
          dotsRef={dotsRef}
          style={slideIndex === index ? activeDotStyle : idleDotStyle}
          onSelect={handleDotClick}
          renderDot={renderDot}
        />
      ))}
      <div
        aria-hidden="true"
        ref={activeDotRef}
        style={{
          position: 'absolute',
          left: activeDotLeft,
          padding: 'inherit',
          transition: `left ${animationSpeed}ms`
        }}
      >
        {customActiveDot ?? (
          <ActiveDot
            sizeForDefaultActiveDot={appearance.sizeForDefaultActiveDot}
            activeDotColor={activeDotColor}
          />
        )}
      </div>
    </DotsWrapper>
  )
}

export default Sliding
