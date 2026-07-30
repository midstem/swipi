import type { JSX } from 'react'
import { memo } from 'react'
import { SlideProps } from './types'

export const Slide = memo(function Slide({
  children,
  animation,
  ariaLabel
}: SlideProps): JSX.Element {
  return (
    <div
      className="swipi-slide"
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel}
      style={animation}
    >
      {children}
    </div>
  )
})
