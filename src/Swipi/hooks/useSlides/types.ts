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
  isLoop: boolean
  lastIndex: number
  slideWidth: number
  isHideArrows: boolean
  spaceBetween: number
  slideOffsets: number[]
  visibleCountSlides: number
}
