import type { JSX } from 'react'
import { ConfigType } from '../../types'
import { SlidesAnimation, ValueOf } from '../../../types'

export type Slides = {
  loop: boolean
  transform: number
  windowWidth: number
  config: ConfigType[]
  biasRight?: boolean
  slidesNumber: number
  children: JSX.Element[]
  spaceBetweenSlides: number
  currentRef: HTMLDivElement | null
  slidesAnimation: ValueOf<SlidesAnimation>
}

export type UseSlidesReturn = {
  /** `loop` prop narrowed down to the cases where looping is possible. */
  isLoop: boolean
  /** Index of the last reachable snap position. */
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  spaceBetween: number
  /** Per-slide horizontal shift that keeps the loop going without clones. */
  slideOffsets: number[]
  visibleCountSlides: number
}
