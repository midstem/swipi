import { MutableRefObject } from 'react'

export type TouchEvents = {
  isLoop: boolean
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  transformRef: MutableRefObject<number>
  moveTo: (value: number) => void
  animateTo: (value: number) => void
}

export type UseEventsReturn = {
  onStart: (x: number) => void
  onMove: (x: number) => void
  onEnd: () => void
}
