/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { SliderProps } from './types';
import { useSlider } from './useSlider';
import { defaultConfig } from './constants';
import CarouselWrapper from '../ui/CarouselWrapper';
import SliderContainer from '../ui/SliderContainer';
import SliderButton from '../ui/SliderButton';
import SlidesWrapper from '../ui/SlidesWrapper';
import SlidesContainer from '../ui/SlidesContainer';
import DotsWrapper from '../ui/DotsWrapper';
import Dot from '../ui/Dot';

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
    spaceBetweenSlides
  );

  return (
    <CarouselWrapper>
      <SliderContainer>
        <SliderButton
          nextButton={nextButton}
          nextImg={nextImg}
          prevImg={prevImg}
        >
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
        <SliderButton
          nextButton={nextButton}
          nextImg={nextImg}
          prevImg={prevImg}
        >
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
