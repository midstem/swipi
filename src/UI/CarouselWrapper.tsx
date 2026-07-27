import type { JSX } from 'react'
import { CarouselWrapperProps } from './types'

const CarouselWrapper = ({
  children,
  className = '',
  ...props
}: CarouselWrapperProps): JSX.Element => (
  <div className={`swipi-wrapper ${className}`} {...props}>
    {children}
  </div>
)

export default CarouselWrapper
