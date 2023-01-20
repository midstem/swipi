import styled from "styled-components";
import { SlidesContainerType } from "./types";

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
