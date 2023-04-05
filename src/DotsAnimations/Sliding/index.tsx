import React from 'react';
import useSlidingEffect from './useSliding';
import DotsWrapper from 'UI/DotsWrapper';
import Dot from 'UI/Dot';
import ActiveDot from 'UI/ActiveDot';
import { DotsTypes } from 'Slider/types';

const Sliding = ({
  children,
  customDot,
  slideIndex,
  customActiveDot,
  sizeForDefaultDot,
  sizeForDefaultActiveDot,
  activeDotColor,
  handleDotClick,
}: DotsTypes): JSX.Element => {
  const { dotsRef, activeDotRef, activeDotLeft } = useSlidingEffect(slideIndex);

  return (
    <DotsWrapper>
      {children.map((_, index) => (
        <div
          key={index}
          ref={(el) => (dotsRef.current[index] = el)}
          onClick={() => {
            handleDotClick(index);
          }}
          style={{
            transition: '0.3s',
            transform: slideIndex === index ? 'scale(0)' : 'scale(1)',
          }}
        >
          {customDot ?? (
            <Dot
              activeDotColor="#c7c7c7"
              sizeForDefaultDot={sizeForDefaultDot}
            />
          )}
        </div>
      ))}

      <div
        ref={activeDotRef}
        style={{
          position: 'absolute',
          left: activeDotLeft,
          opacity: !activeDotLeft ? 0 : 1,
          transition: 'left 0.3s',
        }}
      >
        {customActiveDot ?? (
          <ActiveDot
            sizeForDefaultActiveDot={sizeForDefaultActiveDot}
            activeDotColor={activeDotColor}
          />
        )}
      </div>
    </DotsWrapper>
  );
};
export default Sliding;
