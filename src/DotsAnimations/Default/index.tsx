import Dot from '../../UI/Dot'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'

const Default = ({
  slideIndex,
  customDot,
  customActiveDot,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  dotColor,
  activeDotColor,
  handleDotClick,
  returnDots,
  countShowDots
}: DotsTypes): JSX.Element => {
  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <div
          key={index}
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
        </div>
      ))}
    </DotsWrapper>
  )
}

export default Default
