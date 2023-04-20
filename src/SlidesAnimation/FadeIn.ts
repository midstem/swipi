import { CSSProperties } from 'react';

export const fadeIn = (isOpacity: boolean): CSSProperties => ({
  opacity: isOpacity ? 1 : 0,
  transition: 'opacity 350ms cubic-bezier(0.25, 1, 0.5, 1) 0s'
});
