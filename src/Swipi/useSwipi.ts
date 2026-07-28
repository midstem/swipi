import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { useDots } from './hooks/useDots'
import { useSlides } from './hooks/useSlides'
import { useEvents } from './hooks/useEvents'
import { useTrack } from './hooks/useTrack'
import { useDebounce } from './hooks/useDebounce'
import { useAutoplay } from './hooks/useAutoplay'
import { useTransform } from './hooks/useTransform'
import { useNavigation } from './hooks/useNavigation'
import { useElementWidth } from './hooks/useElementWidth'
import { useWindowResize } from './hooks/useWindowResize'
import {
  ANIMATIONS,
  FIRST_SLIDE,
  FIRST_SLIDE_INDEX,
  NAVIGATION_DEBOUNCE_DELAY
} from './constants'
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
  children,
  autoplay,
  dotColor,
  biasRight,
  customDot,
  showArrows,
  slidesNumber,
  initialSlide,
  autoplaySpeed,
  dotsAnimation,
  activeDotColor,
  animationSpeed,
  slidesAnimation,
  customActiveDot,
  spaceBetweenSlides,
  onChange,
  onSelect
}: UseSwipiType) => {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slidesWrapperRef = useRef<HTMLDivElement>(null)
  const previousSlideWidth = useRef<number>(0)
  const isInitialSlideApplied = useRef<boolean>(false)

  const slidesCount = children.length
  const containerWidth = useElementWidth(slidesWrapperRef)

  const {
    isLoop,
    lastIndex,
    slideWidth,
    isHideArrows,
    spaceBetween,
    visibleCountSlides
  } = useSlides({
    loop,
    config,
    children,
    biasRight,
    windowWidth,
    containerWidth,
    slidesNumber,
    slidesAnimation,
    spaceBetweenSlides
  })

  const { trackRef, slidesRef, render } = useTrack({
    loop: isLoop,
    slideWidth,
    slidesCount
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
    animateTo,
    lastIndex,
    slideWidth,
    isHideArrows,
    transformRef
  })

  const { returnDots, countShowDots } = useDots({
    isLoop,
    dotColor,
    customDot,
    slideIndex,
    slidesCount,
    activeDotColor,
    customActiveDot,
    visibleCountSlides
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
    onChange(getSlidePositions(slideIndex, countShowDots, isLoop))
  }, [countShowDots, isLoop, onChange, slideIndex])

  useEffect(() => {
    onSelect({
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      canScrollNext,
      canScrollPrev
    })
  }, [onSelect, slideIndex, countShowDots, canScrollNext, canScrollPrev])

  return {
    trackRef,
    slidesRef,
    slideIndex,
    slideWidth,
    spaceBetween,
    countShowDots,
    slidesWrapperRef,
    Dots: ANIMATIONS[dotsAnimation],
    isShowArrows: isHideArrows && showArrows,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    returnDots,
    isDisableButton,
    handleDotClick: scrollTo,
    nextImg: useDebounce(nextImg, NAVIGATION_DEBOUNCE_DELAY),
    prevImg: useDebounce(prevImg, NAVIGATION_DEBOUNCE_DELAY)
  }
}
