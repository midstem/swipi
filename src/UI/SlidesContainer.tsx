import React, { useState } from 'react';
import { SlidesContainerProps } from 'UI/types';

const SlidesContainer = ({
  children,
  transform,
  animation,
}: SlidesContainerProps): JSX.Element => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => setIsActive(!isActive);

  return (
    <div
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onMouseDown={toggleActive}
      onMouseUp={toggleActive}
      style={{
        display: 'flex',
        width: 'fit-content',
        transform: `translate3d(${transform}px, 0, 0)`,
        transition: `${animation ? `all 0.3s ease-out 0s` : `0s`}`,
        height: '100%',
        cursor: isActive ? 'grabbing' : 'grab',
      }}
    >
      {children}
    </div>
  );
};

export default SlidesContainer;
