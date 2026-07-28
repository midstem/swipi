import { forwardRef, KeyboardEvent, useImperativeHandle } from 'react'
import { useSwipi } from './useSwipi'
import { SwipiProps, SwipiRef } from './types'
import { returnSlidesAnimation } from './helpers'
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
    children = [],
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
    biasRight = false,
    onChange = () => {},
    onSelect = () => {},
    ariaLabel = 'Slides'
  }: SwipiProps,
  ref
) {
  const {
    Dots,
    trackRef,
    slidesRef,
    slideWidth,
    slideIndex,
    spaceBetween,
    isShowArrows,
    countShowDots,
    slidesWrapperRef,
    nextImg,
    prevImg,
    returnDots,
    onPointerUp,
    onPointerDown,
    onPointerMove,
    handleDotClick,
    isDisableButton
  } = useSwipi({
    loop,
    config,
    children,
    dotColor,
    autoplay,
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

  useImperativeHandle(
    ref,
    () => ({
      scrollNext: nextImg,
      scrollPrev: prevImg,
      scrollTo: handleDotClick,
      selectedScrollSnap: () => slideIndex,
      scrollSnapList: () =>
        Array.from({ length: countShowDots }, (_, index) => index),
      canScrollNext: () => !isDisableButton(true),
      canScrollPrev: () => !isDisableButton()
    }),
    [
      nextImg,
      prevImg,
      handleDotClick,
      slideIndex,
      countShowDots,
      isDisableButton
    ]
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
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <SlidesContainer trackRef={trackRef}>
            {children.map((slide, index) => (
              <Slide
                key={index}
                index={index}
                slidesRef={slidesRef}
                slideWidth={slideWidth}
                spaceBetween={spaceBetween}
                ariaLabel={`${index + 1} of ${children.length}`}
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
          countShowDots={countShowDots}
          dotColor={dotColor}
          customDot={customDot}
          slideIndex={slideIndex}
          activeDotColor={activeDotColor}
          animationSpeed={animationSpeed}
          customActiveDot={customActiveDot}
          sizeForDefaultDot={sizeForDefaultDot}
          sizeForDefaultActiveDot={sizeForDefaultActiveDot}
          handleDotClick={handleDotClick}
          returnDots={returnDots}
        />
      )}
    </CarouselWrapper>
  )
})

export default Swipi
