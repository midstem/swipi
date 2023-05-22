import ActiveDot from '../../UI/ActiveDot'
import Dot from '../../UI/Dot'
import DotsWrapper from '../../UI/DotsWrapper'
import { generateArray } from '../../helpers'
import { DotsTypes } from '../../types'
import useSliding from './useSliding'

const Sliding = ({
  customDot,
  slideIndex,
  customActiveDot,
  dotColor,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  activeDotColor,
  animationSpeed,
  handleDotClick,
  countShowDots
}: DotsTypes): JSX.Element => {
  const { dotsRef, activeDotRef, activeDotLeft } = useSliding(slideIndex)

  return (
    <DotsWrapper>
      {generateArray(countShowDots).map((_, index) => (
        <div
          key={index}
          ref={(el) => (dotsRef.current[index] = el)}
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
        </div>
      ))}
      <div
        ref={activeDotRef}
        style={{
          position: 'absolute',
          left: activeDotLeft,
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
