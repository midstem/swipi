import type { JSX } from 'react'
import { SlideProps } from './types'

export const Slide = ({
  offset,
  slideWidth,
  spaceBetween,
  children,
  animation = {},
  ariaLabel
}: SlideProps): JSX.Element => {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel}
      style={{
        boxSizing: 'border-box',
        flexShrink: 0,
        width: `${slideWidth}px`,
        paddingRight: `${spaceBetween}px`,
        transform: offset ? `translate3d(${offset}px, 0, 0)` : undefined,
        ...animation
      }}
    >
      {children}
    </div>
  )
}
