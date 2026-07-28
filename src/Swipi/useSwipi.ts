import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useDots } from './hooks/useDots'
import { useSlides } from './hooks/useSlides'
import { useEvents } from './hooks/useEvents'
import { useDebounce } from './hooks/useDebounce'
import { useAutoplay } from './hooks/useAutoplay'
import { useTransform } from './hooks/useTransform'
import { useNavigation } from './hooks/useNavigation'
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
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null)

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slidesWrapperRef = useRef<HTMLDivElement>(null)
  const previousSlideWidth = useRef<number>(0)
  const isInitialSlideApplied = useRef<boolean>(false)

  const slidesCount = children.length

  const { transform, target, transformRef, targetRef, moveTo, animateTo } =
    useTransform(animationSpeed)

  const {
    isLoop,
    lastIndex,
    slideWidth,
    isHideArrows,
    spaceBetween,
    slideOffsets,
    visibleCountSlides
  } = useSlides({
    loop,
    config,
    children,
    biasRight,
    transform,
    currentRef,
    windowWidth,
    slidesNumber,
    slidesAnimation,
    spaceBetweenSlides
  })

  /**
   * Derived from the target rather than from the rendered offset, so the state
   * exposed to consumers is already the slide the carousel is heading to.
   */
  const slideIndex = useMemo(
    () =>
      calculateSlideIndex({
        transform: target,
        slideWidth,
        slidesCount,
        lastIndex,
        loop: isLoop
      }),
    [target, slideWidth, slidesCount, lastIndex, isLoop]
  )

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

  const { onEnd, onMove, onStart } = useEvents({
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
    setCurrentRef(slidesWrapperRef.current)
  }, [])

  /**
   * Slide width changes on resize while the track offset stays in pixels, so
   * the current slide is re-snapped to the new geometry.
   */
  useLayoutEffect(() => {
    const width = previousSlideWidth.current

    previousSlideWidth.current = slideWidth

    if (!width || width === slideWidth) return

    moveTo(-Math.round(getTrackPosition(targetRef.current, width)) * slideWidth)
  }, [slideWidth, moveTo, targetRef])

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
    transform,
    slideIndex,
    slideWidth,
    spaceBetween,
    slideOffsets,
    countShowDots,
    slidesWrapperRef,
    Dots: ANIMATIONS[dotsAnimation],
    isShowArrows: isHideArrows && showArrows,
    onEnd,
    onMove,
    onStart,
    returnDots,
    isDisableButton,
    handleDotClick: scrollTo,
    nextImg: useDebounce(nextImg, NAVIGATION_DEBOUNCE_DELAY),
    prevImg: useDebounce(prevImg, NAVIGATION_DEBOUNCE_DELAY)
  }
}
