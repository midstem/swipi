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
import { useDebounce } from './hooks/useDebounce'
import { useAutoplay } from './hooks/useAutoplay'
import { useNavigation } from './hooks/useNavigation'
import { useWindowResize } from './hooks/useWindowResize'
import { ANIMATIONS, NAVIGATION_DEBOUNCE_DELAY } from './constants'
import { UseSwipiType } from './types'
import { getSlidePositions } from './helpers'

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
  animationSpeed,
  dotsAnimation,
  activeDotColor,
  slidesAnimation,
  customActiveDot,
  spaceBetweenSlides,
  onChange,
  onSelect
}: UseSwipiType) => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [animation, setAnimation] = useState<boolean>(false)
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null)

  const [endX, setEndX] = useState<number>(0)
  const [startX, setStartX] = useState<number>(0)
  const [movePath, setMovePath] = useState<number>(0)

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slidesWrapperRef = useRef<HTMLDivElement>(null)

  const {
    slides,
    transform,
    slideWidth,
    isHideArrows,
    spaceBetween,
    cloneCount,
    isLoopEnabled,
    moveSlides,
    setTransform,
    normalizeTransform,
    visibleCountSlides
  } = useSlides({
    loop,
    endX,
    startX,
    config,
    children,
    movePath,
    biasRight,
    currentRef,
    windowWidth,
    slidesNumber,
    slidesAnimation,
    spaceBetweenSlides,
    setMovePath
  })

  const {
    slideIndex,
    nextDot,
    prevDot,
    returnDots,
    setSlideIndex,
    handleDotClick,
    countShowDots
  } = useDots({
    dotColor,
    customDot,
    slideWidth,
    cloneCount,
    dotsAnimation,
    activeDotColor,
    customActiveDot,
    setAnimation,
    setTransform,
    loop,
    children,
    visibleCountSlides
  })

  const isLastSlide = (): boolean => {
    return slideIndex + visibleCountSlides === children.length
  }

  const isFirstSlide = (): boolean => {
    return slideIndex === 0
  }

  const isDisableMove =
    () =>
    (isNext?: boolean): boolean => {
      if (isNext && isLastSlide() && !loop) return true
      if (!isNext && isFirstSlide() && !loop) return true

      return false
    }

  const canScrollNext = !isDisableMove()(true)
  const canScrollPrev = !isDisableMove()(false)

  const handleSettle = useCallback((): void => {
    if (!isLoopEnabled) return

    setAnimation(false)
    setTransform((prev) => normalizeTransform(prev))
  }, [isLoopEnabled, normalizeTransform, setAnimation, setTransform])

  const { onEnd, onMove, onStart } = useEvents({
    startX,
    endX,
    children,
    transform,
    slideWidth,
    cloneCount,
    isHideArrows,
    setEndX,
    setStartX,
    moveSlides,
    setMovePath,
    setAnimation,
    setTransform,
    setSlideIndex,
    isDisableMove: isDisableMove()
  })

  const { nextImg, prevImg } = useNavigation({
    slideWidth,
    setTransform,
    setAnimation,
    animationSpeed,
    isLoopEnabled,
    isDisableMove: isDisableMove()
  })

  useAutoplay({
    timeout,
    autoplay,
    slideIndex,
    autoplaySpeed,
    nextImg: () => nextImg(nextDot)
  })

  useWindowResize(() => {
    setWindowWidth(window.innerWidth)
    setAnimation(false)
  })

  useEffect(() => {
    onChange(getSlidePositions(slideIndex, countShowDots, loop))
  }, [countShowDots, loop, onChange, slideIndex])

  useEffect(() => {
    onSelect({
      selectedIndex: slideIndex,
      snapCount: countShowDots,
      canScrollNext,
      canScrollPrev
    })
  }, [onSelect, slideIndex, countShowDots, canScrollNext, canScrollPrev])

  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth)
    setCurrentRef(slidesWrapperRef.current)
  }, [])

  useEffect(() => {
    if (!slideWidth) return

    const adjustedSlideIndex =
      Math.max(1, Math.min(initialSlide || 1, countShowDots)) - 1

    setTransform(-(cloneCount + adjustedSlideIndex) * slideWidth)
    setSlideIndex(adjustedSlideIndex)
  }, [
    cloneCount,
    countShowDots,
    initialSlide,
    setSlideIndex,
    setTransform,
    slideWidth
  ])

  return {
    slides,
    animation,
    transform,
    slideIndex,
    slideWidth,
    cloneCount,
    spaceBetween,
    countShowDots,
    slidesWrapperRef,
    Dots: ANIMATIONS[dotsAnimation],
    isShowArrows: isHideArrows && showArrows,
    onEnd,
    onMove,
    onStart,
    returnDots,
    setTransform,
    setAnimation,
    handleSettle,
    handleDotClick,
    isDisableButton: isDisableMove(),
    nextImg: useDebounce(() => nextImg(nextDot), NAVIGATION_DEBOUNCE_DELAY),
    prevImg: useDebounce(() => prevImg(prevDot), NAVIGATION_DEBOUNCE_DELAY)
  }
}
