import { useCallback } from 'react'
import { useSwipi } from '../Swipi/useSwipi'
import {
  CAROUSEL_ROLE_DESCRIPTION,
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_ARIA_LABEL,
  DEFAULT_AUTOPLAY_SPEED,
  DEFAULT_INITIAL_SLIDE,
  DEFAULT_SLIDES_NUMBER,
  DEFAULT_SPACE_BETWEEN,
  FOCUSABLE,
  GROUP_ROLE,
  SLIDE_ROLE_DESCRIPTION
} from '../Swipi/constants'
import { noop } from '../helpers'
import {
  getAnnouncement,
  getDotLabel,
  getPositionLabel,
  handleArrowKeys,
  preventDragStart
} from './helpers'
import {
  DotPropsGetter,
  LiveRegionProps,
  SlidePropsGetter,
  SwipiCarousel,
  SwipiCarouselOptions,
  TrackProps,
  ViewportProps
} from './types'

export const useSwipiCarousel = ({
  loop = false,
  dragFree = false,
  biasRight = false,
  autoplay = false,
  config = [],
  slidesNumber = DEFAULT_SLIDES_NUMBER,
  initialSlide = DEFAULT_INITIAL_SLIDE,
  autoplaySpeed = DEFAULT_AUTOPLAY_SPEED,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  spaceBetweenSlides = DEFAULT_SPACE_BETWEEN,
  ariaLabel = DEFAULT_ARIA_LABEL,
  onChange = noop,
  onSelect = noop
}: SwipiCarouselOptions = {}): SwipiCarousel => {
  const { refs, state, handlers } = useSwipi({
    loop,
    config,
    autoplay,
    dragFree,
    biasRight,
    slidesNumber,
    initialSlide,
    autoplaySpeed,
    animationSpeed,
    spaceBetweenSlides,
    onChange,
    onSelect
  })

  const { trackRef, slidesWrapperRef } = refs
  const { slideIndex, slidesCount, countShowDots, hasOverflow } = state
  const { nextImg, prevImg, scrollTo } = handlers

  const getViewportProps = useCallback(
    (): ViewportProps => ({
      ref: slidesWrapperRef,
      role: GROUP_ROLE,
      tabIndex: FOCUSABLE,
      'aria-roledescription': CAROUSEL_ROLE_DESCRIPTION,
      'aria-label': ariaLabel,
      onKeyDown: (event) => handleArrowKeys(event, prevImg, nextImg),
      onPointerDown: handlers.onPointerDown,
      onPointerMove: handlers.onPointerMove,
      onPointerUp: handlers.onPointerUp,
      onPointerCancel: handlers.onPointerUp
    }),
    [slidesWrapperRef, ariaLabel, prevImg, nextImg, handlers]
  )

  const getTrackProps = useCallback(
    (): TrackProps => ({ ref: trackRef, onDragStart: preventDragStart }),
    [trackRef]
  )

  const getSlideProps = useCallback(
    (index: number): SlidePropsGetter => ({
      role: GROUP_ROLE,
      'aria-roledescription': SLIDE_ROLE_DESCRIPTION,
      'aria-label': getPositionLabel(index, slidesCount)
    }),
    [slidesCount]
  )

  const getDotProps = useCallback(
    (index: number): DotPropsGetter => ({
      type: 'button',
      'aria-label': getDotLabel(index),
      'aria-current': index === slideIndex,
      onClick: () => scrollTo(index)
    }),
    [slideIndex, scrollTo]
  )

  const getLiveRegionProps = useCallback(
    (): LiveRegionProps => ({ 'aria-live': 'polite', 'aria-atomic': true }),
    []
  )

  return {
    state: {
      slidesCount,
      hasOverflow,
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      canScrollNext: !state.isDisableButton(true),
      canScrollPrev: !state.isDisableButton(),
      announcement: getAnnouncement(slideIndex, countShowDots)
    },
    scrollNext: nextImg,
    scrollPrev: prevImg,
    scrollTo,
    getViewportProps,
    getTrackProps,
    getSlideProps,
    getDotProps,
    getLiveRegionProps
  }
}
