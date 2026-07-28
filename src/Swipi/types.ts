import type { JSX } from 'react'
import { FunctionComponent, ReactNode } from 'react'
import { DotsTypes, SlidesAnimation, ValueOf } from '../types'

export type ConfigType = {
  maxWidth: number
  biasRight?: boolean
  slidesNumber: number
  spaceBetween?: number
}

export type UseSwipiType = {
  autoplay: boolean
  dotColor?: string
  showArrows: boolean
  config: ConfigType[]
  slidesNumber: number
  initialSlide: number
  autoplaySpeed: number
  children: JSX.Element[]
  activeDotColor?: string
  customDot?: JSX.Element
  spaceBetweenSlides: number
  dotsAnimation: DotsAnimation
  customActiveDot?: JSX.Element
  slidesAnimation: ValueOf<SlidesAnimation>
  animationSpeed: number
  loop: boolean
  dragFree: boolean
  biasRight?: boolean
  onChange: (value: SlidePositions) => void
  onSelect: (state: SwipiState) => void
}

export type SwipiProps = {
  loop?: boolean
  dragFree?: boolean
  biasRight?: boolean
  dotColor?: string
  showDots?: boolean
  autoplay?: boolean
  className?: string
  showArrows?: boolean
  initialSlide?: number
  slidesNumber?: number
  config?: ConfigType[]
  nextButton?: ReactNode
  prevButton?: ReactNode
  autoplaySpeed?: number
  children: JSX.Element[]
  customDot?: JSX.Element
  animationSpeed?: number
  activeDotColor?: string
  sizeForDefaultDot?: number
  spaceBetweenSlides?: number
  customActiveDot?: JSX.Element
  dotsAnimation?: DotsAnimation
  sizeForDefaultActiveDot?: number
  slidesAnimation?: ValueOf<SlidesAnimation>
  onChange?: (value: SlidePositions) => void
  onSelect?: (state: SwipiState) => void
  ariaLabel?: string
}

export type DotsAnimation = 'default' | 'sliding'

export type SwipiState = {
  selectedIndex: number
  snapCount: number
  canScrollNext: boolean
  canScrollPrev: boolean
}

export type SwipiRef = {
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
  selectedScrollSnap: () => number
  scrollSnapList: () => number[]
  canScrollNext: () => boolean
  canScrollPrev: () => boolean
}

export type ReturnSlideWidthType = {
  current?: number
  spaceBetween: number
  visibleCountSlides: number
}

export type AnimationsTypes = {
  [key in DotsAnimation]: FunctionComponent<DotsTypes>
}

export type DragVelocityType = {
  distance: number
  duration: number
}

export type MomentumTargetType = {
  transform: number
  velocity: number
  slideWidth: number
  dragFree: boolean
}

export type MomentumDurationType = {
  distance: number
  velocity: number
  animationSpeed: number
}

export type LoopGeometry = {
  slideWidth: number
  slidesCount: number
  loop: boolean
}

export type SlideOffsetType = LoopGeometry & {
  index: number
  transform: number
}

export type ClampTransformType = {
  transform: number
  slideWidth: number
  lastIndex: number
  loop: boolean
}

export type CalculateSlideIndexType = ClampTransformType & {
  slidesCount: number
}

export type SlidePositions = {
  prev: number
  current: number
  next: number
}
