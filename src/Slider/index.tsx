import { SliderProps } from "./types";
import { useSlider } from "./useSlider";
import { Box } from "./../UI";
import { 
  CarouselWrapper,
  SliderButton,
  SliderContainer,
  SlidesContainer,
  SlidesWrapper,
  DotsWrapper,
  Dot 
} from "./styles";

export const Slider = ({
  defaultCountSlides = 3,
  sx = {},
  nextButton = "⇛",
  prevButton = "⇚",
  children = [],
  sliderUpdates = [],
  defaultSpaceBetween = 0,
  showDots,
  customDot,
  customActiveDot,
  defaultDotColor,
  defaultDotActiveColor,
  defaultDotSize,
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
    moveTouchScreen,
    startTouchByScreen,
  } = useSlider(
    defaultCountSlides,
    children,
    sliderUpdates,
    defaultSpaceBetween
  );

  return (
    <CarouselWrapper>
      <SliderContainer style={sx} onMouseLeave={endTouchScreen}>
        <SliderButton type="submit" onClick={() => {prevImg()}}>
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
          <SlidesContainer animation={animation} transform={transform}>
            {slides?.map(({ id }, index) => (
              <Box
                key={id}
                sx={{
                  boxSizing: "border-box",
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
      {showDots &&
        <DotsWrapper>
        {children.map((_, index) => (
          <div key={index} onClick={() => {handleDotClick(index)}}>
            {customDot 
              ? slideIndex === index ? customActiveDot : customDot 
              : <Dot
                key={index}
                slideIndex={slideIndex}
                index={index}
                defaultDotColor={defaultDotColor}
                defaultDotSize={defaultDotSize}
                defaultDotActiveColor={defaultDotActiveColor}/>
            }
          </div>
            ))
        }
        </DotsWrapper>
      }
    </CarouselWrapper>
  );
};