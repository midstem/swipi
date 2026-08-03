import type { JSX } from 'react'
import { SlidesWrapperProps } from './types'

const SlidesWrapper = ({
  children,
  carouselRef
}: SlidesWrapperProps): JSX.Element => (
  <div ref={carouselRef} className="swipi-viewport">
    {children}
  </div>
)

export default SlidesWrapper
