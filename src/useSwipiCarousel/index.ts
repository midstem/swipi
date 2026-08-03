import { useSwipi } from '../Swipi/useSwipi'
import {
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_AUTOPLAY_SPEED,
  DEFAULT_INITIAL_SLIDE
} from '../Swipi/constants'
import { noop } from '../helpers'
import { SwipiCarouselOptions, UseSwipiCarousel } from './types'

export const useSwipiCarousel = ({
  loop = false,
  dragFree = false,
  autoplay = false,
  slideWidth,
  spaceBetween,
  initialSlide = DEFAULT_INITIAL_SLIDE,
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
    initialSlide,
    autoplaySpeed,
    animationSpeed,
    onChange,
    onSelect
  })

  return [
    carouselRef,
    {
      slidesCount: state.slidesCount,
      hasOverflow: state.hasOverflow,
      selectedIndex: state.slideIndex,
      snapCount: state.countShowDots,
      canScrollNext: state.canScrollNext,
      canScrollPrev: state.canScrollPrev,
      scrollNext: handlers.nextImg,
      scrollPrev: handlers.prevImg,
      scrollTo: handlers.scrollTo
    }
  ]
}
