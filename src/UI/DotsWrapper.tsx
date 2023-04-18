import React from 'react';
import { ComponentBasicProps } from './types';

const DotsWrapper = ({ children }: ComponentBasicProps): JSX.Element => (
  <div className="dots-wrapper">{children}</div>
);
export default DotsWrapper;
