import { RefObject } from 'react'
import { LoopGeometry } from '../../types'

export type UseTrackProps = LoopGeometry & {
  trackRef: RefObject<HTMLDivElement | null>
  spaceBetween: number
}

export type UseTrackReturn = {
  render: (transform: number) => void
}
