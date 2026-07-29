import type { JSX } from 'react'
import { memo, useCallback } from 'react'
import { SlideProps } from './types'

export const Slide = memo(function Slide({
  index,
  slidesRef,
  children,
  animation,
  ariaLabel
}: SlideProps): JSX.Element {
  const setSlideRef = useCallback(
    (node: HTMLDivElement | null): void => {
      slidesRef.current[index] = node
    },
    [slidesRef, index]
  )

  return (
    <div
      ref={setSlideRef}
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
