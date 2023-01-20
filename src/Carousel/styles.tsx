import styled from "styled-components";
import { SliderButton } from "./../Slider/styles";
import { BREAKPOINTS } from "./../constants";
import { isMobile } from "./helpers";

export const Link = styled.a`
  cursor: pointer;
`;

export const SliderWrapper = styled.div`
  padding: 0 10px;
  margin: 0 auto;
  width: 100vw;
  box-sizing: border-box;
  & ${SliderButton} {
    display: ${isMobile() ? "none" : "block"};
  }
  @media (min-width: ${BREAKPOINTS.sm}px) {
    & ${SliderButton} {
      display: block;
    }
    width: 500px;
  }
  @media (min-width: ${BREAKPOINTS.md}px) {
    width: 700px;
  }
  @media (min-width: ${BREAKPOINTS.lg}px) {
    width: 980px;
  }
`;

export const Slide = styled.div`
  height: 300px;
  @media (max-width: ${BREAKPOINTS.md}px) {
    height: 250px;
  }
`;
