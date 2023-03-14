import React from 'react';
import { useSlider } from 'Slider/useSlider';
import { SliderProps } from 'Slider/types';
import { defaultConfig } from 'Slider/constants';
import CarouselWrapper from 'UI/CarouselWrapper';
import SliderContainer from 'UI/SliderContainer';
import SliderButton from 'UI/SliderButton';
import SlidesWrapper from 'UI/SlidesWrapper';
import SlidesContainer from 'UI/SlidesContainer';
import DotsWrapper from 'UI/DotsWrapper';
import Dot from 'UI/Dot';

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
  autoplay = true,
  autoplaySpeed = 4000,
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
    autoplaySpeed
  );

  return (
    <CarouselWrapper>
      <SliderContainer>
        <SliderButton onClick={prevImg}>{isButton && prevButton}</SliderButton>
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
        <SliderButton ref={buttonRef} onClick={nextImg}>
          {isButton && nextButton}
        </SliderButton>
      </SliderContainer>
      {showDots && (
        <DotsWrapper>
          {children.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                handleDotClick(index);
              }}
            >
              {customDot ? (
                returnCustomDots(index)
              ) : (
                <Dot
                  sizeForDefaultDot={sizeForDefaultDot}
                  slideIndex={slideIndex}
                  index={index}
                  activeDotColor={activeDotColor}
                  dotColor={dotColor}
                />
              )}
            </div>
          ))}
        </DotsWrapper>
      )}
    </CarouselWrapper>
  );
};

export default Slider;
