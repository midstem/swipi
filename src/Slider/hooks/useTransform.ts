import { useState, useMemo } from 'react';
import { Transform } from '../types';
import {
  returnCountSlides,
  returnSlideWidth,
  returnSpaceBetween,
  addUniqueId,
  isCornerSlide,
} from '../helpers';

export const useTransform = ({
  children,
  config,
  windowWidth,
  slidesNumber,
  spaceBetweenSlides,
  currentRef,
}: Transform) => {
  const [transform, setTransform] = useState<number>(0);

  const visibleCountSlides = returnCountSlides(
    config,
    windowWidth,
    slidesNumber
  );

  const spaceBetween = returnSpaceBetween(
    config,
    windowWidth,
    spaceBetweenSlides
  );

  const isButton = children.length > visibleCountSlides;

  const returnSlideWidthArgs = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: currentRef,
    }),
    [currentRef, spaceBetween, visibleCountSlides]
  );

  const slideWidth = useMemo(
    () =>
      isCornerSlide(config, windowWidth)
        ? returnSlideWidth(returnSlideWidthArgs) * 0.85
        : returnSlideWidth(returnSlideWidthArgs),
    [config, returnSlideWidthArgs, windowWidth]
  );

  const slides = useMemo(
    () =>
      isButton
        ? addUniqueId([...children, ...children, ...children])
        : addUniqueId(children),
    [isButton, children]
  );

  return {
    transform,
    setTransform,
    slideWidth,
    spaceBetween,
    isButton,
    slides,
  };
};
