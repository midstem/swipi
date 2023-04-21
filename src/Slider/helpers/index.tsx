import { CSSProperties, MutableRefObject } from 'react'
import { AddUniqueIdReturnType, ReturnSlideWidthType } from '../types'
import { generateUniqueID } from '../../helpers'
import { SlidesAnimation, ValueOf } from '../../types'
import { fadeIn } from '../../SlidesAnimation/FadeIn'
import { defaultSliderWidth } from '../constants'

export const getSliderWidth = (current: HTMLDivElement | null): number =>
  current?.getBoundingClientRect().width ?? defaultSliderWidth

export const addUniqueId = (slides: JSX.Element[]): AddUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: generateUniqueID() }))

export const returnSlideWidth = ({
  visibleCountSlides,
  current,
  spaceBetween
}: ReturnSlideWidthType): number =>
  (getSliderWidth(current) + spaceBetween) / visibleCountSlides

export const calculateSlideIndex = (
  transform: number,
  slideWidth: number,
  children: JSX.Element[]
): number => {
  const result = Math.round(Math.abs(transform / slideWidth))

  return Math.abs(result % children.length)
}

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: MutableRefObject<NodeJS.Timeout | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    nextImg()
  }, autoplaySpeed)
}

export const isButtonFn = (
  children: JSX.Element[],
  visibleCountSlides: number
) => children.length > visibleCountSlides

export const setKeyToChildren = (children: JSX.Element[]): JSX.Element[] => {
  return children.map((child, index) => ({ ...child, key: index }))
}

export const returnSlidesAnimation = (
  animation: ValueOf<SlidesAnimation>,
  isVisible: boolean
): CSSProperties => {
  switch (animation) {
    case SlidesAnimation.FADE_IN:
      return fadeIn(isVisible)
    default:
      return {}
  }
}

export const isFadeInAnimation = (animation: ValueOf<SlidesAnimation>) => {
  return animation === SlidesAnimation.FADE_IN
}

export const getSliderBorders = (
  slideWidth: number,
  childrenCount: number,
  visibleCountSlides: number
) => ({
  left: -childrenCount * slideWidth,
  right: -childrenCount * 2 * slideWidth + visibleCountSlides * slideWidth
})
