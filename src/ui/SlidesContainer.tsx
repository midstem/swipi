/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { SlidesContainerProps } from './types';

const SlidesContainer = ({
  children,
  transform,
  animation,
}: SlidesContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleHovered = () => setIsHovered(!isHovered);
  const toggleActive = () => setIsActive(!isActive);

  return (
    <div
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onMouseEnter={toggleHovered}
      onMouseDown={toggleActive}
      onMouseLeave={toggleHovered}
      onMouseUp={toggleActive}
      style={{
        display: 'flex',
        width: 'fit-content',
        transform: `translate3d(${transform}px, 0, 0)`,
        transition: `${animation ? `all 0.3s ease-out 0s` : `0s`}`,
        height: '100%',
        cursor: isHovered && isActive ? 'grabbing' : 'grab',
      }}
    >
      {children}
    </div>
  );
};

export default SlidesContainer;
