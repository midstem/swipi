import { defaultSliderWidth } from 'src/Slider/constants'
import { AddUniqueIdReturnType, ReturnSlideWidthType } from 'src/Slider/types'
import { generateUniqueID } from 'src/helpers'
import { MutableRefObject } from 'react'

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

export const isButton = (children: JSX.Element[], visibleCountSlides: number) =>
  children.length > visibleCountSlides
