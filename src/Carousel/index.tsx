import { Box } from "./../UI";

import { Slide, SliderWrapper } from "./styles";
import { sliderUpdates } from "./constants";
import { Slider } from "./../Slider";
import { ArrowLeft, ArrowRight } from "./arrows";

const Carousel = (): JSX.Element => {
  return (
    <SliderWrapper>
      <Slider
        nextButton={<ArrowRight />}
        prevButton={<ArrowLeft />}
        sliderUpdates={sliderUpdates}
        defaultSpaceBetween={4}
      >
        <Slide key={1}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "red",
            }}
          />
        </Slide>
        <Slide key={2}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "blue",
            }}
          />
        </Slide>
        <Slide key={2}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "yellow",
            }}
          />
        </Slide>
        <Slide key={2}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "green",
            }}
          />
        </Slide>
        <Slide key={2}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "black",
            }}
          />
        </Slide>
      </Slider>
    </SliderWrapper>
  );
};

export default Carousel;
