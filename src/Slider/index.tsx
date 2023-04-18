import { useSlider } from 'src/Slider/hooks/useSlider'
import { SliderProps } from 'src/Slider/types'
import CarouselWrapper from 'src/UI/CarouselWrapper'
import SliderContainer from 'src/UI/SliderContainer'
import SliderButton from 'src/UI/SliderButton'
import SlidesWrapper from 'src/UI/SlidesWrapper'
import SlidesContainer from 'src/UI/SlidesContainer'

const Slider = ({
  slidesNumber = 3,
  spaceBetweenSlides = 0,
  nextButton = 'ᐳ',
  prevButton = 'ᐸ',
  children = [],
  config = [],
  showDots,
  customDot,
  customActiveDot,
  dotColor,
  activeDotColor,
  sizeForDefaultDot,
  sizeForDefaultActiveDot = 13,
  autoplay = false,
  autoplaySpeed = 4000,
  dotsAnimation = 'default',
  animationSpeed = 300
}: SliderProps) => {
  const {
    animation,
    transform,
    slideWidth,
    slidesWrapperRef,
    slides,
    isButton,
    spaceBetween,
    slideIndex,
    Dots,
    handleDotClick,
    nextImg,
    prevImg,
    onEnd,
    returnDots,
    onMove,
    onStart
  } = useSlider(
    children,
    config,
    customActiveDot,
    customDot,
    slidesNumber,
    spaceBetweenSlides,
    autoplay,
    autoplaySpeed,
    dotsAnimation,
    dotColor,
    activeDotColor
  )

  return (
    <CarouselWrapper>
      <SliderContainer>
        <SliderButton onClick={prevImg} className="right-button">
          {isButton && prevButton}
        </SliderButton>
        <SlidesWrapper
          slidesWrapperRef={slidesWrapperRef}
          startTouchByScreen={onStart}
          moveTouchScreen={onMove}
          endTouchScreen={onEnd}
        >
          <SlidesContainer
            animation={animation}
            transform={transform}
            animationSpeed={animationSpeed}
          >
            {slides?.map(({ id }, index) => (
              <div
                key={id}
                style={{
                  boxSizing: 'border-box',
                  width: `${slideWidth}px`,
                  paddingRight: `${spaceBetween}px`
                }}
              >
                {slides[index]}
              </div>
            ))}
          </SlidesContainer>
        </SlidesWrapper>
        <SliderButton onClick={nextImg} className="left-button">
          {isButton && nextButton}
        </SliderButton>
      </SliderContainer>
      {showDots && (
        <Dots
          children={children}
          customDot={customDot}
          customActiveDot={customActiveDot}
          slideIndex={slideIndex}
          sizeForDefaultDot={sizeForDefaultDot}
          sizeForDefaultActiveDot={sizeForDefaultActiveDot}
          activeDotColor={activeDotColor}
          dotColor={dotColor}
          animationSpeed={animationSpeed}
          handleDotClick={handleDotClick}
          returnDots={returnDots}
        />
      )}
    </CarouselWrapper>
  )
}

export default Slider
