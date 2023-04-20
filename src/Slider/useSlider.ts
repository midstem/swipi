import { Slider } from './types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSlides } from './hooks/useSlides'
import { useDots } from './hooks/useDots'
import { useEvents } from './hooks/useEvents'
import { useNavigation } from './hooks/useNavigation'
import { useAutoplay } from './hooks/useAutoplay'
import { useWindowResize } from './hooks/useWindowResize'
import { ANIMATIONS } from './constants'

export const useSlider = ({
  children,
  config,
  customActiveDot,
  customDot,
  slidesNumber,
  spaceBetweenSlides,
  autoplay,
  autoplaySpeed,
  dotsAnimation,
  slidesAnimation,
  dotColor,
  activeDotColor,
  loop
}: Slider) => {
  const [animation, setAnimation] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null)

  const [startX, setStartX] = useState<number>(0)
  const [endX, setEndX] = useState<number>(0)
  const [movePath, setMovePath] = useState<number>(0)

  const slidesWrapperRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<NodeJS.Timer>()

  const {
    isButton,
    setTransform,
    slideWidth,
    slides,
    spaceBetween,
    transform,
    startTransform,
    checkAreaBeyondSlider,
    jumpToTheLastSlide,
    moveSlides
  } = useSlides({
    children,
    config,
    windowWidth,
    currentRef,
    slidesNumber,
    spaceBetweenSlides,
    slidesAnimation,
    startX,
    endX,
    movePath,
    setMovePath
  })

  const {
    handleDotClick,
    slideIndex,
    setSlideIndex,
    returnDots,
    nextDot,
    prevDot
  } = useDots({
    setTransform,
    slideWidth,
    dotsAnimation,
    customActiveDot,
    customDot,
    setAnimation,
    dotColor,
    activeDotColor
  })

  const checkSliderCorner = useCallback(
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
    isButton,
    transform,
    slideWidth,
    startTransform,
    children,
    setAnimation,
    setTransform,
    setSlideIndex,
    checkSliderCorner,
    checkAreaBeyondSlider,
    jumpToTheLastSlide,
    moveSlides,
    setStartX,
    setEndX,
    setMovePath
  })

  const { nextImg, prevImg } = useNavigation({
    putInTheInitialPosition,
    checkSliderCorner,
    setTransform,
    setAnimation,
    slideWidth,
    children
  })

  useAutoplay({
    autoplay,
    autoplaySpeed,
    slideIndex,
    nextImg: () => nextImg(nextDot),
    timeout
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
    animation,
    slides,
    transform,
    slideWidth,
    slidesWrapperRef,
    isButton,
    spaceBetween,
    slideIndex,
    Dots: ANIMATIONS[dotsAnimation],
    returnDots,
    nextImg: () => nextImg(nextDot),
    prevImg: () => prevImg(prevDot),
    setTransform,
    setAnimation,
    handleDotClick,
    onEnd,
    onMove,
    onStart
  }
}
