import React from 'react';
import { ComponentBasicProps } from 'UI/types';

const DotsWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div
    className="dots-wrapper"
    style={{
      display: 'flex',
      gap: '5px',
    }}
  >
    {children}
  </div>
);

export default DotsWrapper;
