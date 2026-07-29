import type { JSX } from 'react'
import { RenderDot } from './UI/types'

export type DotsAppearance = {
  dotColor?: string
  activeDotColor?: string
  customDot?: JSX.Element
  customActiveDot?: JSX.Element
  sizeForDefaultDot?: number
  sizeForDefaultActiveDot: number
}

export type DotsTypes = {
  slideIndex: number
  countShowDots: number
  animationSpeed: number
  appearance: DotsAppearance
  handleDotClick: (index: number) => void
  returnDots: RenderDot
}

export enum SlidesAnimation {
  DEFAULT = 'default',
  FADE_IN = 'fade-in'
}

export type ValueOf<T extends string> = `${T}`
