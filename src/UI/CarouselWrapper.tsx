import React from 'react';
import { ComponentBasicProps } from './types';

const CarouselWrapper = ({
  children,
  className = '',
  ...props
}: ComponentBasicProps): JSX.Element => (
  <div className={`slider ${className}`} {...props}>
    {children}
  </div>
);

export default CarouselWrapper;
