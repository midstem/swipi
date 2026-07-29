import type { JSX } from 'react'
import Dot from '../../UI/Dot'
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
  const {
    dotColor,
    customDot,
    activeDotColor,
    customActiveDot,
    sizeForDefaultDot,
    sizeForDefaultActiveDot
  } = appearance

  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <button
          key={index}
          type="button"
          className="swipi-dot"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={slideIndex === index}
          onClick={() => {
            handleDotClick(index)
          }}
        >
          {customDot || customActiveDot ? (
            returnDots(index)
          ) : (
            <Dot
              index={index}
              slideIndex={slideIndex}
              sizeForDefaultDot={sizeForDefaultDot}
              sizeForDefaultActiveDot={sizeForDefaultActiveDot}
              dotColor={dotColor}
              activeDotColor={activeDotColor}
            />
          )}
        </button>
      ))}
    </DotsWrapper>
  )
}

export default Default
