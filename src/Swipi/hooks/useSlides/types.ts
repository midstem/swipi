import type { JSX } from 'react'
import { ConfigType } from '../../types'
import { SlidesAnimation, ValueOf } from '../../../types'

export type Slides = {
  loop: boolean
  endX: number
  startX: number
  movePath: number
  windowWidth: number
  config: ConfigType[]
  biasRight?: boolean
  slidesNumber: number
  children: JSX.Element[]
  spaceBetweenSlides: number
  currentRef: HTMLDivElement | null
  slidesAnimation: ValueOf<SlidesAnimation>
  setMovePath: (value: number) => void
}
