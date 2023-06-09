import { useSwipi } from './useSwipi'
import { SwipiProps } from './types'
import { returnSlidesAnimation } from './helpers'
import { Slide } from '../UI/Slide'
import SwipiButton from '../UI/SwipiButton'
import SlidesWrapper from '../UI/SlidesWrapper'
import SwipiContainer from '../UI/SwipiContainer'
import SlidesContainer from '../UI/SlidesContainer'
import CarouselWrapper from '../UI/CarouselWrapper'
import '../UI/styles.css'

const Swipi = ({
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
  onChange = () => {}
}: SwipiProps) => {
  const {
    Dots,
    slides,
    animation,
    transform,
    slideWidth,
    slideIndex,
    spaceBetween,
    isShowArrows,
    countShowDots,
    slidesWrapperRef,
    onEnd,
    onMove,
    nextImg,
    prevImg,
    onStart,
    returnDots,
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
    customActiveDot,
    slidesAnimation,
    spaceBetweenSlides,
    onChange
  })

  return (
    <CarouselWrapper className={className}>
      <SwipiContainer>
        <SwipiButton
          disabled={isDisableButton()}
          onClick={prevImg}
          className="left-button"
        >
          {isShowArrows && prevButton}
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
        <SwipiButton
          disabled={isDisableButton(true)}
          onClick={nextImg}
          className="right-button"
        >
          {isShowArrows && nextButton}
        </SwipiButton>
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
}

export default Swipi
