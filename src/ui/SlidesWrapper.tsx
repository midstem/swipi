/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { SlidesWrapperProps } from './types';

const SlidesWrapper = ({
  children,
  slidesWrapperRef,
  startTouchByScreen,
  moveTouchScreen,
  endTouchScreen,
}: SlidesWrapperProps) => (
  <div
    ref={slidesWrapperRef}
    onTouchStart={(e) => startTouchByScreen(e.touches[0].clientX)}
    onTouchMove={(e) => moveTouchScreen(e.touches[0].clientX)}
    onTouchEnd={endTouchScreen}
    onMouseDown={(e) => startTouchByScreen(e.clientX)}
    onMouseMove={(e) => moveTouchScreen(e.clientX)}
    onMouseUp={endTouchScreen}
    onMouseLeave={endTouchScreen}
    style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export default SlidesWrapper;
