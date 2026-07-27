import type { JSX } from 'react'
import { FunctionComponent, ReactNode } from 'react'
import { DotsTypes, SlidesAnimation, ValueOf } from '../types'
import { SwipeDirections } from './constants'

export type AddUniqueIdReturnType = Array<{ id: string } & JSX.Element>

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
  animationSpeed: number
  children: JSX.Element[]
  activeDotColor?: string
  customDot?: JSX.Element
  spaceBetweenSlides: number
  dotsAnimation: DotsAnimation
  customActiveDot?: JSX.Element
  slidesAnimation: ValueOf<SlidesAnimation>
  loop: boolean
  biasRight?: boolean
  onChange: (value: SlidePositions) => void
  onSelect: (state: SwipiState) => void
}

export type SwipiProps = {
  loop?: boolean
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

export type NextPrevDotType = {
  prev: number
  slideWidth: number
  children: JSX.Element[]
}

export type AnimationsTypes = {
  [key in DotsAnimation]: FunctionComponent<DotsTypes>
}

export type SetWithPrev = (value: number | ((prev: number) => number)) => void

export type TouchCoordsType = {
  touchStartX: number
  touchEndX: number
}

export type CalculateSliderTransformT = {
  transform: number
  slideWidth: number
  swipedSide: SwipeDirections | null
  timeTouch: Date
  isDisableMove: boolean
}

export type SlidePositions = {
  prev: number
  current: number
  next: number
}
