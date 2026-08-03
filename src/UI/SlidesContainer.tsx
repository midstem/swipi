import type { JSX } from 'react'
import { SlidesContainerProps } from './types'

const SlidesContainer = ({ children }: SlidesContainerProps): JSX.Element => (
  <div className="swipi-track">{children}</div>
)

export default SlidesContainer
