import type { JSX } from 'react'
import { SlideProps } from './types'

export const Slide = ({
  slideWidth,
  spaceBetween,
  children,
  animation = {},
  ariaLabel,
  isClone
}: SlideProps): JSX.Element => {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel}
      aria-hidden={isClone || undefined}
      inert={isClone || undefined}
      style={{
        boxSizing: 'border-box',
        width: `${slideWidth}px`,
        paddingRight: `${spaceBetween}px`,
        ...animation
      }}
    >
      {children}
    </div>
  )
}
