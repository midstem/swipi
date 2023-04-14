import DotsWrapper from 'src/UI/DotsWrapper'
import Dot from 'src/UI/Dot'
import { DotsTypes } from 'src/types'

const Default = ({
  children,
  slideIndex,
  customDot,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  dotColor,
  activeDotColor,
  handleDotClick,
  returnDots
}: DotsTypes): JSX.Element => (
  <DotsWrapper>
    {children.map((_, index) => (
      <div
        key={index}
        onClick={() => {
          handleDotClick(index)
        }}
      >
        {customDot ? (
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

export default Default
