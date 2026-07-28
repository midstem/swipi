import { MutableRefObject, RefObject } from 'react'
import { LoopGeometry } from '../../types'

export type UseTrackProps = LoopGeometry

export type UseTrackReturn = {
  trackRef: RefObject<HTMLDivElement | null>
  slidesRef: MutableRefObject<(HTMLDivElement | null)[]>
  render: (transform: number) => void
}
