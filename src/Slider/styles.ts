import styled from "styled-components";
import { DotType, SlidesContainerType } from "./types";

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const SliderButton = styled.button`
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
  &:active {
    opacity: 0.5;
  }
`;

export const SlidesContainer = styled.div<SlidesContainerType>(
  ({ animation, transform }) => `
    display: flex;
    width: fit-content;
    transform: translate3d(${transform}px, 0,0);
    transition: ${animation ? `all 0.3s ease-out 0s` : `0s`};
    height: 100%;
`
);

export const SlidesWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const DotsWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

export const Dot = styled.div<DotType>`
    height: 12px;
    width: 12px;
    background-color: ${({slideIndex, index}) => slideIndex === index ? 'black' : 'red'};
    border-radius: 50%;
    cursor: pointer;
`;
