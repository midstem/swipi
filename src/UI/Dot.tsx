import { DotProps } from './types'

const Dot = ({
  index,
  slideIndex,
  sizeForDefaultDot = 12,
  sizeForDefaultActiveDot = 12,
  dotColor = '#c7c7c7',
  activeDotColor = 'black'
}: DotProps): JSX.Element => (
  <div
    data-cy="default-dot"
    style={{
      aspectRatio: '1 / 1',
      width: slideIndex === index ? sizeForDefaultActiveDot : sizeForDefaultDot,
      backgroundColor: slideIndex === index ? activeDotColor : dotColor,
      borderRadius: '50%',
      cursor: 'pointer'
    }}
  />
)

export default Dot
