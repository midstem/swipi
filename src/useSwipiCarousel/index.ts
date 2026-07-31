import { useCallback } from 'react'
import { useLatestRef } from '../Swipi/hooks/useLatestRef'
import { useSwipi } from '../Swipi/useSwipi'
import {
  CAROUSEL_ROLE_DESCRIPTION,
  FIRST_SLIDE,
  DEFAULT_ANIMATION_SPEED,
  DEFAULT_AUTOPLAY_SPEED,
  DEFAULT_INITIAL_SLIDE,
  FOCUSABLE,
  GROUP_ROLE,
  SLIDE_ROLE_DESCRIPTION
} from '../Swipi/constants'
import { noop } from '../helpers'
import { handleArrowKeys, preventDragStart, withDefaultLabels } from './helpers'
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
  autoplay = false,
  slideWidth,
  spaceBetween,
  initialSlide = DEFAULT_INITIAL_SLIDE,
  autoplaySpeed = DEFAULT_AUTOPLAY_SPEED,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  labels,
  onChange = noop,
  onSelect = noop
}: SwipiCarouselOptions = {}): SwipiCarousel => {
  const { refs, state, handlers } = useSwipi({
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

  const text = useLatestRef(withDefaultLabels(labels))

  const { trackRef, slidesWrapperRef } = refs
  const { slideIndex, slidesCount, countShowDots, hasOverflow } = state
  const { nextImg, prevImg, scrollTo } = handlers

  const getViewportProps = useCallback(
    (): ViewportProps => ({
      ref: slidesWrapperRef,
      role: GROUP_ROLE,
      tabIndex: FOCUSABLE,
      'aria-roledescription': CAROUSEL_ROLE_DESCRIPTION,
      'aria-label': text.current.carousel,
      onKeyDown: (event) => handleArrowKeys(event, prevImg, nextImg),
      onPointerDown: handlers.onPointerDown,
      onPointerMove: handlers.onPointerMove,
      onPointerUp: handlers.onPointerUp,
      onPointerCancel: handlers.onPointerUp
    }),
    [slidesWrapperRef, text, prevImg, nextImg, handlers]
  )

  const getTrackProps = useCallback(
    (): TrackProps => ({ ref: trackRef, onDragStart: preventDragStart }),
    [trackRef]
  )

  const getSlideProps = useCallback(
    (index: number): SlidePropsGetter => ({
      role: GROUP_ROLE,
      'aria-roledescription': SLIDE_ROLE_DESCRIPTION,
      'aria-label': text.current.slide(index + FIRST_SLIDE, slidesCount)
    }),
    [slidesCount, text]
  )

  const getDotProps = useCallback(
    (index: number): DotPropsGetter => ({
      type: 'button',
      'aria-label': text.current.dot(index + FIRST_SLIDE),
      'aria-current': index === slideIndex,
      onClick: () => scrollTo(index)
    }),
    [slideIndex, scrollTo, text]
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
      announcement: text.current.announcement(
        slideIndex + FIRST_SLIDE,
        countShowDots
      )
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
