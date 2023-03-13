import React from 'react';
import { SlidesWrapperProps } from 'UI/types';

const SlidesWrapper = ({
  children,
  slidesWrapperRef,
  startTouchByScreen,
  moveTouchScreen,
  endTouchScreen,
}: SlidesWrapperProps): JSX.Element => (
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
