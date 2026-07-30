import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { useSlides } from './hooks/useSlides'
import { useEvents } from './hooks/useEvents'
import { useTrack } from './hooks/useTrack'
import { useAutoplay } from './hooks/useAutoplay'
import { useTransform } from './hooks/useTransform'
import { useLatestRef } from './hooks/useLatestRef'
import { useNavigation } from './hooks/useNavigation'
import { useElementWidth } from './hooks/useElementWidth'
import { useWindowResize } from './hooks/useWindowResize'
import { FIRST_SLIDE, FIRST_SLIDE_INDEX } from './constants'
import { UseSwipiType } from './types'
import {
  calculateSlideIndex,
  clamp,
  getSlidePositions,
  getTrackPosition
} from './helpers'

export const useSwipi = ({
  loop,
  config,
  autoplay,
  dragFree,
  biasRight,
  slidesCount,
  slidesNumber,
  initialSlide,
  autoplaySpeed,
  animationSpeed,
  spaceBetweenSlides,
  onChange,
  onSelect
}: UseSwipiType) => {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slidesWrapperRef = useRef<HTMLDivElement>(null)
  const previousSlideWidth = useRef<number>(0)
  const isInitialSlideApplied = useRef<boolean>(false)

  const containerWidth = useElementWidth(slidesWrapperRef)

  const onChangeRef = useLatestRef(onChange)
  const onSelectRef = useLatestRef(onSelect)

  const {
    isLoop,
    lastIndex,
    slideWidth,
    hasOverflow,
    spaceBetween,
    countShowDots
  } = useSlides({
    loop,
    config,
    biasRight,
    windowWidth,
    slidesCount,
    containerWidth,
    slidesNumber,
    spaceBetweenSlides
  })

  const { trackRef, slidesRef, render } = useTrack({
    loop: isLoop,
    slideWidth,
    slidesCount,
    spaceBetween
  })

  const [slideIndex, setSlideIndex] = useState<number>(FIRST_SLIDE_INDEX)

  const syncSlideIndex = useCallback(
    (target: number): void => {
      const index = calculateSlideIndex({
        transform: target,
        slideWidth,
        slidesCount,
        lastIndex,
        loop: isLoop
      })

      setSlideIndex((previous) => (previous === index ? previous : index))
    },
    [slideWidth, slidesCount, lastIndex, isLoop]
  )

  const { transformRef, targetRef, moveTo, animateTo } = useTransform({
    animationSpeed,
    render,
    onTarget: syncSlideIndex
  })

  const canScrollNext = isLoop || slideIndex < lastIndex
  const canScrollPrev = isLoop || slideIndex > FIRST_SLIDE_INDEX

  const isDisableButton = useCallback(
    (isNext?: boolean): boolean => !(isNext ? canScrollNext : canScrollPrev),
    [canScrollNext, canScrollPrev]
  )

  const { nextImg, prevImg, scrollTo } = useNavigation({
    isLoop,
    lastIndex,
    targetRef,
    animateTo,
    slideWidth,
    slidesCount,
    canScrollNext,
    canScrollPrev
  })

  const { onPointerDown, onPointerMove, onPointerUp } = useEvents({
    isLoop,
    moveTo,
    dragFree,
    animateTo,
    lastIndex,
    slideWidth,
    hasOverflow,
    animationSpeed,
    transformRef
  })

  useAutoplay({
    timeout,
    autoplay,
    slideIndex,
    autoplaySpeed,
    nextImg
  })

  useWindowResize(() => setWindowWidth(window.innerWidth))

  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useLayoutEffect(() => {
    const width = previousSlideWidth.current

    previousSlideWidth.current = slideWidth

    if (!width || width === slideWidth) return

    moveTo(-Math.round(getTrackPosition(targetRef.current, width)) * slideWidth)
  }, [slideWidth, moveTo, targetRef])

  useLayoutEffect(() => {
    render(transformRef.current)
    syncSlideIndex(targetRef.current)
  })

  useEffect(() => {
    if (!initialSlide || isInitialSlideApplied.current || slideWidth <= 0)
      return

    isInitialSlideApplied.current = true

    moveTo(
      -(clamp(initialSlide, FIRST_SLIDE, countShowDots) - FIRST_SLIDE) *
        slideWidth
    )
  }, [initialSlide, countShowDots, slideWidth, moveTo])

  useEffect(() => {
    onChangeRef.current(getSlidePositions(slideIndex, countShowDots, isLoop))
  }, [countShowDots, isLoop, slideIndex, onChangeRef])

  useEffect(() => {
    onSelectRef.current({
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      canScrollNext,
      canScrollPrev
    })
  }, [slideIndex, countShowDots, canScrollNext, canScrollPrev, onSelectRef])

  return {
    refs: { trackRef, slidesRef, slidesWrapperRef },
    state: {
      slideIndex,
      countShowDots,
      hasOverflow,
      isDisableButton
    },
    handlers: {
      nextImg,
      prevImg,
      scrollTo,
      onPointerDown,
      onPointerMove,
      onPointerUp
    }
  }
}
