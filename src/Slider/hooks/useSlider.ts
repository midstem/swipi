import { useEffect, useRef, useState, useCallback } from 'react'
import { useSlides } from 'src/Slider/hooks/useSlides'
import { useWindowResize } from 'src/Slider/hooks/useWindowResize'
import { useAutoplay } from 'src/Slider/hooks/useAutoplay'
import { useEvents } from 'src/Slider/hooks/useEvents'
import { useDots } from 'src/Slider/hooks/useDots'
import { useNavigation } from 'src/Slider/hooks/useNavigation'
import { ConfigType } from 'src/Slider/types'
import { ANIMATIONS } from 'src/Slider/constants'

export const useSlider = (
  children: JSX.Element[],
  config: ConfigType[],
  customActiveDot: JSX.Element | undefined,
  customDot: JSX.Element | undefined,
  slidesNumber: number,
  spaceBetweenSlides: number,
  autoplay: boolean,
  autoplaySpeed: number,
  dotsAnimation: string,
  dotColor?: string,
  activeDotColor?: string
) => {
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
    checkAreaWithoutSlides,
    jumpToTheLastSlide,
    moveSlides
  } = useSlides({
    children,
    config,
    windowWidth,
    currentRef,
    slidesNumber,
    spaceBetweenSlides,
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
    previousDot
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
    checkAreaWithoutSlides,
    jumpToTheLastSlide,
    moveSlides,
    setStartX,
    setEndX,
    setMovePath
  })

  const { navigateSlide } = useNavigation({
    putInTheInitialPosition,
    checkSliderCorner,
    setTransform,
    setAnimation,
    slideWidth,
    children
  })

  const nextImg = navigateSlide(nextDot, true)

  const prevImg = navigateSlide(previousDot)

  useAutoplay({ autoplay, autoplaySpeed, slideIndex, nextImg, timeout })

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
    nextImg,
    prevImg,
    setTransform,
    setAnimation,
    handleDotClick,
    onEnd,
    onMove,
    onStart
  }
}
