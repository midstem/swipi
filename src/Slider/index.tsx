import { SliderButton, SliderContainer, SlidesContainer } from "./styles";
import { useSlider } from "./useSlider";
import { Box } from "./../UI";
import { SliderProps } from "./types";

export const Slider = ({
  defaultCountSlides = 3,
  sx = {},
  nextButton = "⇛",
  prevButton = "⇚",
  children = [],
  sliderUpdates = [],
  defaultSpaceBetween = 0,
}: SliderProps) => {
  const {
    animation,
    nextImg,
    prevImg,
    transform,
    slideWidth,
    ref,
    slides,
    endTouchScreen,
    moveTouchScreen,
    startTouchByScreen,
    isButton,
    spaceBetween,
  } = useSlider(
    defaultCountSlides,
    children,
    sliderUpdates,
    defaultSpaceBetween
  );

  return (
    <SliderContainer style={sx}>
      <SliderButton type="submit" onClick={prevImg}>
        {isButton && prevButton}
      </SliderButton>
      <div
        onTouchStart={(e) => startTouchByScreen(e.touches[0].clientX)}
        onTouchMove={(e) => moveTouchScreen(e.touches[0].clientX)}
        onTouchEnd={endTouchScreen}
        style={{ overflow: "hidden", height: "100%", width: "100%" }}
        ref={ref}
      >
        <SlidesContainer animation={animation} transform={transform}>
          {slides.map(({ id }, index) => (
            <Box
              key={id}
              sx={{
                width: `${slideWidth}px`,
                paddingRight: `${spaceBetween}px`,
              }}
            >
              {slides[index]}
            </Box>
          ))}
        </SlidesContainer>
      </div>

      <SliderButton type="submit" onClick={nextImg}>
        {isButton && nextButton}
      </SliderButton>
    </SliderContainer>
  );
};
