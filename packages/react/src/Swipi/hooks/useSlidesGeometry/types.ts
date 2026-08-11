import { RefObject } from 'react'
import { SlideOffsets } from '@swipi/core'

export type UseSlidesGeometryProps = {
  trackRef: RefObject<HTMLElement | null>
  offsetsRef: RefObject<SlideOffsets>
  slideWidth?: number
  spaceBetween?: number
}
