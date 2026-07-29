import type { JSX, ReactNode } from 'react'

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
  returnDots: (index: number) => ReactNode
}

export enum SlidesAnimation {
  DEFAULT = 'default',
  FADE_IN = 'fade-in'
}

export type ValueOf<T extends string> = `${T}`
