import { Box } from "./../UI";
import { Slide, SliderWrapper } from "./styles";
import { sliderUpdates } from "./constants";
import { Slider } from "./../Slider";
import { ArrowLeft, ArrowRight } from "./arrows";

type CarouselProps = {
  showDots?: boolean
}

const Carousel = ({showDots}: CarouselProps): JSX.Element => {
  return (
    <SliderWrapper>
      <Slider
        nextButton={<ArrowRight />}
        prevButton={<ArrowLeft />}
        sliderUpdates={sliderUpdates}
        defaultSpaceBetween={4}
        showDots={showDots}
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
        <Slide key={3}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "yellow",
            }}
          />
        </Slide>
        <Slide key={4}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "green",
            }}
          />
        </Slide>
        <Slide key={5}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "black",
            }}
          />
        </Slide>
        <Slide key={6}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "brown",
            }}
          />
        </Slide>
        <Slide key={7}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "#ff00b3",
            }}
          />
        </Slide>
        <Slide key={8}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "purple",
            }}
          />
        </Slide>
        <Slide key={9}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "#8cd844",
            }}
          />
        </Slide>
        <Slide key={10}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "black",
            }}
          />
        </Slide>
        <Slide key={11}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "#d844d8",
            }}
          />
        </Slide>
        <Slide key={12}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              background: "orange",
            }}
          />
        </Slide>
      </Slider>
    </SliderWrapper>
  );
};

export default Carousel;
