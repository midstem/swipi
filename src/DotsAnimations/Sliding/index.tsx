import type { JSX } from 'react'
import ActiveDot from '../../UI/ActiveDot'
import Dot from '../../UI/Dot'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'
import useSliding from './useSliding'

const Sliding = ({
  dotColor,
  customDot,
  slideIndex,
  countShowDots,
  activeDotColor,
  animationSpeed,
  customActiveDot,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  handleDotClick
}: DotsTypes): JSX.Element => {
  const { dotsRef, activeDotRef, activeDotLeft } = useSliding(slideIndex)

  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <button
          key={index}
          type="button"
          className="swipi-dot"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={slideIndex === index}
          ref={(el) => {
            dotsRef.current[index] = el
          }}
          onClick={() => {
            handleDotClick(index)
          }}
          style={{
            transition: `${animationSpeed}ms`,
            transform: slideIndex === index ? 'scale(0)' : 'scale(1)'
          }}
        >
          {customDot ?? (
            <Dot
              index={index}
              dotColor={dotColor}
              sizeForDefaultDot={sizeForDefaultDot}
            />
          )}
        </button>
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
            sizeForDefaultActiveDot={sizeForDefaultActiveDot}
            activeDotColor={activeDotColor}
          />
        )}
      </div>
    </DotsWrapper>
  )
}
export default Sliding
