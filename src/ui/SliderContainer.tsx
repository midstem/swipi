import React from 'react';
import { ComponentBasicProps } from './types';

const SliderContainer = ({ children }: ComponentBasicProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    }}
  >
    {children}
  </div>
);

export default SliderContainer;
