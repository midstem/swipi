import useSliding from 'src/DotsAnimations/Sliding/useSliding'
import DotsWrapper from 'src/UI/DotsWrapper'
import Dot from 'src/UI/Dot'
import ActiveDot from 'src/UI/ActiveDot'
import { DotsTypes } from 'src/types'

const Sliding = ({
  children,
  customDot,
  slideIndex,
  customActiveDot,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  activeDotColor,
  animationSpeed,
  handleDotClick
}: DotsTypes): JSX.Element => {
  const { dotsRef, activeDotRef, activeDotLeft } = useSliding(slideIndex)

  return (
    <DotsWrapper>
      {children.map((_, index) => (
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
              activeDotColor="#c7c7c7"
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
          opacity: !activeDotLeft ? 0 : 1,
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
