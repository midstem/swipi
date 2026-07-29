import {
  Children,
  forwardRef,
  KeyboardEvent,
  useImperativeHandle,
  useMemo
} from 'react'
import { useSwipi } from './useSwipi'
import { SwipiProps, SwipiRef } from './types'
import { getSlideKey, returnSlidesAnimation } from './helpers'
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

  const { refs, state, handlers, dots } = useSwipi({
    loop,
    config,
    slides,
    dotColor,
    autoplay,
    dragFree,
    biasRight,
    customDot,
    showArrows,
    slidesNumber,
    initialSlide,
    autoplaySpeed,
    dotsAnimation,
    activeDotColor,
    animationSpeed,
    customActiveDot,
    slidesAnimation,
    spaceBetweenSlides,
    onChange,
    onSelect
  })

  const { trackRef, slidesRef, slidesWrapperRef } = refs
  const { slideIndex, countShowDots, isShowArrows, isDisableButton } = state
  const { nextImg, prevImg, scrollTo } = handlers
  const { Dots, returnDots } = dots

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
          returnDots={returnDots}
        />
      )}
    </CarouselWrapper>
  )
})

export default Swipi
