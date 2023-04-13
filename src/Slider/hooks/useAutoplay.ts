import { startAutoplay } from '../helpers';
import { useEffect } from 'react';

export const useAutoplay = (
  autoplay: boolean,
  autoplaySpeed: number,
  buttonRef: React.RefObject<HTMLButtonElement>
) => {
  useEffect(() => {
    if (!autoplay) return;
    startAutoplay(autoplaySpeed, buttonRef);
  }, [buttonRef, autoplaySpeed, autoplay]);
};
