import React from 'react';
import { ComponentBasicProps } from 'UI/types';

const CarouselWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}
  >
    {children}
  </div>
);

export default CarouselWrapper;
