import React from 'react';
import { SlidesContainerProps } from './types';

const SlidesContainer = ({
  children,
  transform,
  animation,
}: SlidesContainerProps) => (
  <div
    // onDragStart={(e) => {
    //   e.preventDefault();
    // }}
    style={{
      display: 'flex',
      width: 'fit-content',
      transform: `translate3d(${transform}px, 0, 0)`,
      transition: `${animation ? `all 0.3s ease-out 0s` : `0s`}`,
      height: '100%',
      //   &:hover {
      //     cursor: grab;
      //   }
      //   &:active {
      //     cursor: grabbing;
    }}
  >
    {children}
  </div>
);

export default SlidesContainer;
