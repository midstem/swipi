import type { JSX } from 'react'
import { DotProps } from './types'

const Dot = ({
  isActive = false,
  sizeForDefaultDot = 12,
  sizeForDefaultActiveDot = 12,
  dotColor = '#c7c7c7',
  activeDotColor = 'black'
}: DotProps): JSX.Element => (
  <div
    style={{
      aspectRatio: '1 / 1',
      width: isActive ? sizeForDefaultActiveDot : sizeForDefaultDot,
      backgroundColor: isActive ? activeDotColor : dotColor,
      borderRadius: '50%',
      cursor: 'pointer'
    }}
  />
)

export default Dot
