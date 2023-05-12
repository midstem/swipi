import { Slide } from '../UI/Slide'
import { returnSlidesAnimation } from './helpers'
import { SwipiProps } from './types'
import { useSwipi } from './useSwipi'
import SwipiContainer from '../UI/SwipiContainer'
import SwipiButton from '../UI/SwipiButton'
import SlidesWrapper from '../UI/SlidesWrapper'
import SlidesContainer from '../UI/SlidesContainer'
import CarouselWrapper from '../UI/CarouselWrapper'
import '../UI/styles.css'

const Swipi = ({
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
  animationSpeed = 300,
  slidesAnimation = 'default',
  className
}: SwipiProps) => {
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
  } = useSwipi({
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
    activeDotColor,
    slidesAnimation
  })

  return (
    <CarouselWrapper className={className}>
      <SwipiContainer>
        <SwipiButton onClick={prevImg} className="left-button">
          {isButton && prevButton}
        </SwipiButton>
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
            {slides?.map(({ id, key }, index) => (
              <Slide
                key={id}
                slideWidth={slideWidth}
                spaceBetween={spaceBetween}
                animation={returnSlidesAnimation(
                  slidesAnimation,
                  key === slideIndex
                )}
              >
                {slides[index]}
              </Slide>
            ))}
          </SlidesContainer>
        </SlidesWrapper>
        <SwipiButton onClick={nextImg} className="right-button">
          {isButton && nextButton}
        </SwipiButton>
      </SwipiContainer>
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

export default Swipi
