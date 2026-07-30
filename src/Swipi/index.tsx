import {
  Children,
  forwardRef,
  KeyboardEvent,
  useImperativeHandle,
  useMemo
} from 'react'
import { useSwipi } from './useSwipi'
import { SwipiProps, SwipiRef } from './types'
import {
  getSlideKey,
  isFadeInAnimation,
  returnSlidesAnimation,
  toCoreConfig
} from './helpers'
import { ONE_SLIDE } from './constants'
import { ANIMATIONS } from '../DotsAnimations'
import { Slide } from '../UI/Slide'
import LiveRegion from '../UI/LiveRegion'
import SwipiButton from '../UI/SwipiButton'
import SlidesWrapper from '../UI/SlidesWrapper'
import SwipiContainer from '../UI/SwipiContainer'
import SlidesContainer from '../UI/SlidesContainer'
import CarouselWrapper from '../UI/CarouselWrapper'
import '../UI/styles.css'

const Swipi = forwardRef<SwipiRef, SwipiProps>(function Swipi(
  {
    showDots,
    dotColor,
    customDot,
    config = [],
    children,
    activeDotColor,
    customActiveDot,
    slidesNumber = 3,
    initialSlide = 0,
    nextButton = 'ᐳ',
    prevButton = 'ᐸ',
    autoplay = false,
    sizeForDefaultDot,
    showArrows = true,
    autoplaySpeed = 4000,
    animationSpeed = 300,
    spaceBetweenSlides = 0,
    dotsAnimation = 'default',
    slidesAnimation = 'default',
    sizeForDefaultActiveDot = 13,
    className,
    loop = false,
    dragFree = false,
    biasRight = false,
    onChange = () => {},
    onSelect = () => {},
    ariaLabel = 'Slides'
  }: SwipiProps,
  ref
) {
  const slides = useMemo(() => Children.toArray(children), [children])

  const dotsAppearance = useMemo(
    () => ({
      dotColor,
      customDot,
      activeDotColor,
      customActiveDot,
      sizeForDefaultDot,
      sizeForDefaultActiveDot
    }),
    [
      dotColor,
      customDot,
      activeDotColor,
      customActiveDot,
      sizeForDefaultDot,
      sizeForDefaultActiveDot
    ]
  )

  const isFadeIn = isFadeInAnimation(slidesAnimation)

  const coreConfig = useMemo(
    () => toCoreConfig(config, slidesAnimation),
    [config, slidesAnimation]
  )

  const { refs, state, handlers } = useSwipi({
    loop,
    autoplay,
    dragFree,
    initialSlide,
    autoplaySpeed,
    animationSpeed,
    spaceBetweenSlides,
    config: coreConfig,
    slidesCount: slides.length,
    slidesNumber: isFadeIn ? ONE_SLIDE : slidesNumber,
    biasRight: isFadeIn ? false : biasRight,
    onChange,
    onSelect
  })

  const { trackRef, slidesRef, slidesWrapperRef } = refs
  const { slideIndex, countShowDots, hasOverflow, isDisableButton } = state
  const { nextImg, prevImg, scrollTo } = handlers

  const Dots = ANIMATIONS[dotsAnimation]
  const isShowArrows = hasOverflow && showArrows

  useImperativeHandle(
    ref,
    () => ({
      scrollNext: nextImg,
      scrollPrev: prevImg,
      scrollTo,
      selectedScrollSnap: () => slideIndex,
      scrollSnapList: () =>
        Array.from({ length: countShowDots }, (_, index) => index),
      canScrollNext: () => !isDisableButton(true),
      canScrollPrev: () => !isDisableButton()
    }),
    [nextImg, prevImg, scrollTo, slideIndex, countShowDots, isDisableButton]
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowLeft') prevImg()
    if (event.key === 'ArrowRight') nextImg()
  }

  return (
    <CarouselWrapper
      className={className}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      <LiveRegion current={slideIndex + 1} total={countShowDots} />
      <SwipiContainer>
        {isShowArrows && (
          <SwipiButton
            disabled={isDisableButton()}
            onClick={prevImg}
            className="left-button"
            ariaLabel="Previous slide"
          >
            {prevButton}
          </SwipiButton>
        )}
        <SlidesWrapper
          slidesWrapperRef={slidesWrapperRef}
          onPointerDown={handlers.onPointerDown}
          onPointerMove={handlers.onPointerMove}
          onPointerUp={handlers.onPointerUp}
        >
          <SlidesContainer trackRef={trackRef}>
            {slides.map((slide, index) => (
              <Slide
                key={getSlideKey(slide, index)}
                index={index}
                slidesRef={slidesRef}
                ariaLabel={`${index + 1} of ${slides.length}`}
                animation={returnSlidesAnimation(
                  slidesAnimation,
                  index === slideIndex
                )}
              >
                {slide}
              </Slide>
            ))}
          </SlidesContainer>
        </SlidesWrapper>
        {isShowArrows && (
          <SwipiButton
            disabled={isDisableButton(true)}
            onClick={nextImg}
            className="right-button"
            ariaLabel="Next slide"
          >
            {nextButton}
          </SwipiButton>
        )}
      </SwipiContainer>
      {showDots && (
        <Dots
          slideIndex={slideIndex}
          countShowDots={countShowDots}
          animationSpeed={animationSpeed}
          appearance={dotsAppearance}
          handleDotClick={scrollTo}
        />
      )}
    </CarouselWrapper>
  )
})

export default Swipi
