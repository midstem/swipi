/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { SliderProps } from './types';
import { useSlider } from './useSlider';
import { Box } from '../UI';
import {
  CarouselWrapper,
  SliderButton,
  SliderContainer,
  SlidesContainer,
  SlidesWrapper,
  DotsWrapper,
  Dot,
} from './styles';
import { defaultConfig } from './constants';

const Slider = ({
  sx = {},
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
    ref,
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
      <SliderContainer style={sx}>
        <SliderButton
          type="submit"
          onClick={() => {
            prevImg();
          }}
        >
          {isButton && prevButton}
        </SliderButton>
        <SlidesWrapper
          ref={ref}
          onTouchStart={(e) => startTouchByScreen(e.touches[0].clientX)}
          onTouchMove={(e) => moveTouchScreen(e.touches[0].clientX)}
          onTouchEnd={endTouchScreen}
          onMouseDown={(e) => startTouchByScreen(e.clientX)}
          onMouseMove={(e) => moveTouchScreen(e.clientX)}
          onMouseUp={endTouchScreen}
          onMouseLeave={endTouchScreen}
        >
          <SlidesContainer
            animation={animation}
            transform={transform}
            onDragStart={(e) => {
              e.preventDefault();
            }}
          >
            {slides?.map(({ id }, index) => (
              <Box
                key={id}
                sx={{
                  boxSizing: 'border-box',
                  width: `${slideWidth}px`,
                  paddingRight: `${spaceBetween}px`,
                }}
              >
                {slides[index]}
              </Box>
            ))}
          </SlidesContainer>
        </SlidesWrapper>
        <SliderButton type="submit" onClick={nextImg}>
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
                  slideIndex={slideIndex}
                  index={index}
                  dotColor={dotColor}
                  activeDotColor={activeDotColor}
                  sizeForDefaultDot={sizeForDefaultDot}
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
