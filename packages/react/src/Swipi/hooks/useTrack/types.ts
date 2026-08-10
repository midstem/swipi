import { RefObject } from 'react'
import { SlideOffsets, SlidesGeometry } from '../../types'

export type UseTrackProps = {
  loop: boolean
  trackRef: RefObject<HTMLElement | null>
  geometry: SlidesGeometry
  offsetsRef: RefObject<SlideOffsets>
}

export type UseTrackReturn = {
  render: (transform: number) => void
}
