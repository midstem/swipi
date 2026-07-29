import type { JSX } from 'react'
import { RenderDot } from '../../../UI/types'

export type DotsProps = {
  isLoop: boolean
  dotColor?: string
  slidesCount: number
  activeDotColor?: string
  customDot?: JSX.Element
  customActiveDot?: JSX.Element
  visibleCountSlides: number
}

export type UseDotsReturn = {
  returnDots: RenderDot
  countShowDots: number
}
