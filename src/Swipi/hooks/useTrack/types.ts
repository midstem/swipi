import { RefObject } from 'react'
import { SlidesGeometry } from '../../types'

export type UseTrackProps = {
  loop: boolean
  trackRef: RefObject<HTMLElement | null>
  geometry: SlidesGeometry
}

export type UseTrackReturn = {
  render: (transform: number) => void
}
