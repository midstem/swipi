import React from 'react';
import DotsWrapper from '../../UI/DotsWrapper';
import Dot from '../../UI/Dot';
import { DotsTypes } from '../../types';

const Default = ({
  children,
  customDot,
  sizeForDefaultDot,
  slideIndex,
  activeDotColor,
  dotColor,
  handleDotClick,
  returnCustomDots,
}: DotsTypes): JSX.Element => (
  <DotsWrapper>
    {children.map((_, index) => (
      <div
        key={index}
        onClick={() => {
          handleDotClick(index);
        }}
      >
        {customDot ? (
          returnCustomDots(index)
        ) : (
          <Dot
            index={index}
            slideIndex={slideIndex}
            sizeForDefaultDot={sizeForDefaultDot}
            dotColor={dotColor}
            activeDotColor={activeDotColor}
          />
        )}
      </div>
    ))}
  </DotsWrapper>
);

export default Default;
