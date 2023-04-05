import React from 'react';
import { ComponentBasicProps } from './types';

const DotsWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div
    className="dots-wrapper"
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    {children}
  </div>
);

export default DotsWrapper;
