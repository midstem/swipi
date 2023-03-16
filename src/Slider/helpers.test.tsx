import React from 'react';
import { expect, describe, it } from 'vitest';
import {
  getSliderWidth,
  addUniqueId,
  getSliderUpdatesParam,
  isCornerSlide,
  returnCountSlides,
  returnSpaceBetween,
  returnSlideWidth,
  calculateSlideIndex,
} from 'Slider/helpers';
import { defaultSliderWidth } from 'Slider/constants';

describe('getSliderWidth', () => {
  it(`returns default width ${defaultSliderWidth}`, () => {
    expect(getSliderWidth(null)).toBe(defaultSliderWidth);
  });

  it('returns the width of the slider element when available', () => {
    const mockedRef = {
      current: {
        getBoundingClientRect: () => ({ width: 200 }),
      },
    };
    expect(getSliderWidth(mockedRef.current as HTMLDivElement)).toBe(200);
  });
});

describe('addUniqueId', () => {
  it('return slides with uniq id', () => {
    const slides = addUniqueId([<div />]);
    expect(slides).toStrictEqual(slides.filter((slide) => slide.id));
  });
});

describe('getSliderUpdatesParam', () => {
  it('returns number of slides', () => {
    const config = [{ slidesNumber: 2, maxWidth: 1600 }];

    expect(getSliderUpdatesParam(config, 700, 'slidesNumber')).toBe(2);
  });

  it('returns true when biasRight is set', () => {
    const config = [{ slidesNumber: 2, maxWidth: 1600, biasRight: true }];

    expect(getSliderUpdatesParam(config, 800, 'biasRight')).toBe(true);
  });

  it('returns space between', () => {
    const config = [{ slidesNumber: 2, maxWidth: 1600, spaceBetween: 3 }];

    expect(getSliderUpdatesParam(config, 800, 'spaceBetween')).toBe(3);
  });
});

describe('isCornerSlide', () => {
  it('returns true value when biasRight is set to true', () => {
    const config = [{ slidesNumber: 4, maxWidth: 1600, biasRight: true }];

    expect(isCornerSlide(config, 700)).toBe(true);
  });

  it('returns false when biasRight is not set', () => {
    expect(isCornerSlide([], 800)).toBe(false);
  });
});

describe('returnCountSlides', () => {
  it('returns custom number of slides', () => {
    const config = [{ slidesNumber: 4, maxWidth: 1600 }];

    expect(returnCountSlides(config, 800, 2)).toBe(4);
  });

  it('returns default number of slides', () => {
    expect(returnCountSlides([], 800, 3)).toBe(3);
  });
});

describe('returnSpaceBetween', () => {
  it('returns custom spaceBetween', () => {
    const config = [{ slidesNumber: 2, maxWidth: 1200, spaceBetween: 4 }];

    expect(returnSpaceBetween(config, 800, 2)).toBe(4);
  });

  it('returns default spaceBetween', () => {
    expect(returnSpaceBetween([], 800, 3)).toBe(3);
  });
});

describe('returnSlideWidth', () => {
  it('returns slide width', () => {
    const mockedRef = {
      current: {
        getBoundingClientRect: () => ({ width: 779 }),
      },
    };
    expect(
      returnSlideWidth({
        visibleCountSlides: 2,
        current: mockedRef.current as HTMLDivElement,
        spaceBetween: 0,
      })
    ).toBe(389.5);
  });
});

describe('calculateSlideIndex', () => {
  it('return slide index', () => {
    const children = [<div />, <div />, <div />, <div />];
    expect(calculateSlideIndex(-778, 390, children)).eq(2);
  });
});
