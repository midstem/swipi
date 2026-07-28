import type { JSX } from 'react'
import { useCallback } from 'react'
import { SlideProps } from './types'

export const Slide = ({
  index,
  slidesRef,
  slideWidth,
  spaceBetween,
  children,
  animation = {},
  ariaLabel
}: SlideProps): JSX.Element => {
  const setSlideRef = useCallback(
    (node: HTMLDivElement | null): void => {
      slidesRef.current[index] = node
    },
    [slidesRef, index]
  )

  return (
    <div
      ref={setSlideRef}
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel}
      style={{
        boxSizing: 'border-box',
        flexShrink: 0,
        width: `${slideWidth}px`,
        paddingRight: `${spaceBetween}px`,
        ...animation
      }}
    >
      {children}
    </div>
  )
}
