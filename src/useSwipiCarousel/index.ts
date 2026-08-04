import { useMemo } from 'react'
import { useSwipi } from '../Swipi/useSwipi'
import {
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_AUTOPLAY_SPEED,
  DEFAULT_START_INDEX
} from '../Swipi/constants'
import { SwipiCarousel, SwipiCarouselOptions, UseSwipiCarousel } from './types'

const noop = (): void => {}

export const useSwipiCarousel = ({
  loop = false,
  dragFree = false,
  autoplay = false,
  slideWidth,
  spaceBetween,
  startIndex = DEFAULT_START_INDEX,
  autoplaySpeed = DEFAULT_AUTOPLAY_SPEED,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  onChange = noop,
  onSelect = noop
}: SwipiCarouselOptions = {}): UseSwipiCarousel => {
  const { carouselRef, state, handlers } = useSwipi({
    loop,
    autoplay,
    dragFree,
    slideWidth,
    spaceBetween,
    startIndex,
    autoplaySpeed,
    animationSpeed,
    onChange,
    onSelect
  })

  const carousel = useMemo<SwipiCarousel>(
    () => ({
      slidesCount: state.slidesCount,
      hasOverflow: state.hasOverflow,
      selectedIndex: state.slideIndex,
      snapCount: state.countShowDots,
      canScrollNext: state.canScrollNext,
      canScrollPrev: state.canScrollPrev,
      scrollNext: handlers.nextImg,
      scrollPrev: handlers.prevImg,
      scrollTo: handlers.scrollTo
    }),
    [
      state.slidesCount,
      state.hasOverflow,
      state.slideIndex,
      state.countShowDots,
      state.canScrollNext,
      state.canScrollPrev,
      handlers.nextImg,
      handlers.prevImg,
      handlers.scrollTo
    ]
  )

  return [carouselRef, carousel]
}
