import React from 'react';
import { ComponentBasicProps } from './types';

const DotsWrapper = ({ children }: ComponentBasicProps) => (
  <div
    style={{
      display: 'flex',
      gap: '5px',
    }}
  >
    {children}
  </div>
);

export default DotsWrapper;
