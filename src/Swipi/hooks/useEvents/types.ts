import type { JSX } from 'react'
import { SetWithPrev } from '../../types'

export type TouchEvents = {
  endX: number
  startX: number
  transform: number
  slideWidth: number
  cloneCount: number
  isHideArrows: boolean
  children: JSX.Element[]
  moveSlides: () => void
  setTransform: SetWithPrev
  setEndX: (value: number) => void
  setStartX: (value: number) => void
  setMovePath: (value: number) => void
  setSlideIndex: (index: number) => void
  setAnimation: (animation: boolean) => void
  isDisableMove: (value: boolean) => boolean
}
