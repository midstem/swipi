import React from 'react';
import { useSlider } from 'Slider/useSlider';
import { SliderProps } from 'Slider/types';
import { defaultConfig } from 'Slider/constants';
import CarouselWrapper from 'UI/CarouselWrapper';
import SliderContainer from 'UI/SliderContainer';
import SliderButton from 'UI/SliderButton';
import SlidesWrapper from 'UI/SlidesWrapper';
import SlidesContainer from 'UI/SlidesContainer';

const Slider = ({
  slidesNumber = 3,
  spaceBetweenSlides = 0,
  nextButton = 'ᐳ',
  prevButton = 'ᐸ',
  children = [],
  config = defaultConfig,
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
    buttonRef,
    Dots,
    handleDotClick,
    nextImg,
    prevImg,
    endTouchScreen,
    returnCustomDots,
    moveTouchScreen,
    startTouchByScreen,
  } = useSlider(
    children,
    config,
    customActiveDot,
    customDot,
    slidesNumber,
    spaceBetweenSlides,
    autoplay,
    autoplaySpeed,
    dotsAnimation
  );

  return (
    <CarouselWrapper>
      <SliderContainer>
        <SliderButton onClick={prevImg} className="right-button">
          {isButton && prevButton}
        </SliderButton>
        <SlidesWrapper
          slidesWrapperRef={slidesWrapperRef}
          startTouchByScreen={startTouchByScreen}
          moveTouchScreen={moveTouchScreen}
          endTouchScreen={endTouchScreen}
        >
          <SlidesContainer animation={animation} transform={transform}>
            {slides?.map(({ id }, index) => (
              <div
                key={id}
                style={{
                  boxSizing: 'border-box',
                  width: `${slideWidth}px`,
                  paddingRight: `${spaceBetween}px`,
                }}
              >
                {slides[index]}
              </div>
            ))}
          </SlidesContainer>
        </SlidesWrapper>
        <SliderButton ref={buttonRef} onClick={nextImg} className="left-button">
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
          handleDotClick={handleDotClick}
          returnCustomDots={returnCustomDots}
        />
      )}
    </CarouselWrapper>
  );
};

export default Slider;
