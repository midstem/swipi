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
import { ArrowLeft, ArrowRight } from "./arrows";
import { defaultSliderUpdates } from "./constants";

export const Slider = ({
  sx = {},
  nextButton = <ArrowRight />,
  prevButton = <ArrowLeft />,
  children = [],
  sliderUpdates = [],
  showDots,
  customDot,
  customActiveDot,
  colorForDefaultDot,
  colorForDefaultActiveDot,
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
    moveTouchScreen,
    startTouchByScreen,
  } = useSlider(
    children,
    sliderUpdates = sliderUpdates.length === 0 ? defaultSliderUpdates : sliderUpdates,
  );

  return (
    <CarouselWrapper>
      <SliderContainer style={sx}>
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
                slideIndex={slideIndex}
                index={index}
                colorForDefaultDot={colorForDefaultDot}
                colorForDefaultActiveDot={colorForDefaultActiveDot}
                sizeForDefaultDot={sizeForDefaultDot}/>
            }
          </div>
            ))
        }
        </DotsWrapper>
      }
    </CarouselWrapper>
  );
};