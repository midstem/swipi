export const getFirstPosition = (slideIndex: number, dotWidth: number) =>
  slideIndex === 0 ? 0 : dotWidth / 2;

export const getWidthDifference = (dotWidth: number, activeDotWidth: number) =>
  (dotWidth - activeDotWidth) / 2;
