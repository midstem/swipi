import { useCallback, useEffect, useRef, useState } from 'react'
import { useDots } from './hooks/useDots'
import { useSlides } from './hooks/useSlides'
import { useEvents } from './hooks/useEvents'
import { useDebounce } from './hooks/useDebounce'
import { useAutoplay } from './hooks/useAutoplay'
import { useNavigation } from './hooks/useNavigation'
import { useWindowResize } from './hooks/useWindowResize'
import { ANIMATIONS, NAVIGATION_DEBOUNCE_DELAY } from './constants'
import { UseSwipiType } from './types'
import { returnCountOfDots } from './helpers'

export const useSwipi = ({
  config,
  children,
  autoplay,
  dotColor,
  customDot,
  showArrows,
  slidesNumber,
  autoplaySpeed,
  dotsAnimation,
  activeDotColor,
  slidesAnimation,
  customActiveDot,
  spaceBetweenSlides,
  loop
}: UseSwipiType) => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [animation, setAnimation] = useState<boolean>(false)
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null)

  const [endX, setEndX] = useState<number>(0)
  const [startX, setStartX] = useState<number>(0)
  const [movePath, setMovePath] = useState<number>(0)

  const timeout = useRef<NodeJS.Timer>()
  const slidesWrapperRef = useRef<HTMLDivElement>(null)

  const {
    slides,
    transform,
    slideWidth,
    isHideArrows,
    spaceBetween,
    startTransform,
    moveSlides,
    setTransform,
    jumpToTheLastSlide,
    checkAreaBeyondSwipi,
    visibleCountSlides
  } = useSlides({
    endX,
    startX,
    config,
    children,
    movePath,
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
    handleDotClick
  } = useDots({
    dotColor,
    customDot,
    slideWidth,
    dotsAnimation,
    activeDotColor,
    customActiveDot,
    setAnimation,
    setTransform,
    loop
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

  const checkSwipiCorner = useCallback(
    (): boolean =>
      transform <= startTransform * 2 + slideWidth / 2 ||
      transform >= -slideWidth / 2,
    [transform, slideWidth, startTransform]
  )

  const putInTheInitialPosition = useCallback(
    (callback?: () => void): (() => void) => {
      setTransform(startTransform)
      setAnimation(false)

      const timer = setTimeout(() => {
        callback?.()
        setAnimation(true)
      }, 1)

      return () => clearTimeout(timer)
    },
    [startTransform, setAnimation, setTransform]
  )

  const { onEnd, onMove, onStart } = useEvents({
    startX,
    endX,
    children,
    transform,
    slideWidth,
    isHideArrows,
    startTransform,
    setEndX,
    setStartX,
    moveSlides,
    setMovePath,
    setAnimation,
    setTransform,
    setSlideIndex,
    checkSwipiCorner,
    jumpToTheLastSlide,
    checkAreaBeyondSwipi,
    isDisableMove: isDisableMove()
  })

  const { nextImg, prevImg } = useNavigation({
    children,
    slideWidth,
    setTransform,
    setAnimation,
    checkSwipiCorner,
    putInTheInitialPosition,
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
    setSlideIndex(0)
    setTransform(0)
  })

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    setCurrentRef(slidesWrapperRef.current)
  }, [])

  return {
    slides,
    animation,
    transform,
    slideIndex,
    slideWidth,
    isShowArrows: isHideArrows && showArrows,
    spaceBetween,
    slidesWrapperRef,
    Dots: ANIMATIONS[dotsAnimation],
    onEnd,
    onMove,
    onStart,
    returnDots,
    setTransform,
    setAnimation,
    handleDotClick,
    nextImg: useDebounce(() => nextImg(nextDot), NAVIGATION_DEBOUNCE_DELAY),
    prevImg: useDebounce(() => prevImg(prevDot), NAVIGATION_DEBOUNCE_DELAY),
    countShowDots: returnCountOfDots(children, visibleCountSlides, loop),
    isDisableButton: isDisableMove()
  }
}
