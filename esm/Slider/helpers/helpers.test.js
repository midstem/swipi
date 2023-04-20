"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const vitest_1 = require("vitest");
const constants_1 = require("../constants");
const index_1 = require("./index");
(0, vitest_1.describe)('getSliderWidth', () => {
    (0, vitest_1.it)(`returns default width ${constants_1.defaultSliderWidth}`, () => {
        (0, vitest_1.expect)((0, index_1.getSliderWidth)(null)).toBe(constants_1.defaultSliderWidth);
    });
    (0, vitest_1.it)('returns the width of the slider element when available', () => {
        const mockedRef = {
            current: {
                getBoundingClientRect: () => ({ width: 200 })
            }
        };
        (0, vitest_1.expect)((0, index_1.getSliderWidth)(mockedRef.current)).toBe(200);
    });
});
(0, vitest_1.describe)('addUniqueId', () => {
    (0, vitest_1.it)('return slides with uniq id', () => {
        const slides = (0, index_1.addUniqueId)([(0, jsx_runtime_1.jsx)("div", {})]);
        (0, vitest_1.expect)(slides).toStrictEqual(slides.filter((slide) => slide.id));
    });
});
// describe('getSliderUpdatesParam', () => {
//   it('returns number of slides', () => {
//     const config = [{ slidesNumber: 2, maxWidth: 1600 }]
//     expect(getSliderUpdatesParam(config, 700, 'slidesNumber')).toBe(2)
//   })
//   it('returns true when biasRight is set', () => {
//     const config = [{ slidesNumber: 2, maxWidth: 1600, biasRight: true }]
//     expect(getSliderUpdatesParam(config, 800, 'biasRight')).toBe(true)
//   })
//   it('returns space between', () => {
//     const config = [{ slidesNumber: 2, maxWidth: 1600, spaceBetween: 3 }]
//     expect(getSliderUpdatesParam(config, 800, 'spaceBetween')).toBe(3)
//   })
// })
// describe('isCornerSlide', () => {
//   it('returns true value when biasRight is set to true', () => {
//     const config = [{ slidesNumber: 4, maxWidth: 1600, biasRight: true }]
//     expect(isCornerSlide(config, 700)).toBe(true)
//   })
//   it('returns false when biasRight is not set', () => {
//     expect(isCornerSlide([], 800)).toBe(false)
//   })
// })
// describe('returnCountSlides', () => {
//   it('returns custom number of slides', () => {
//     const config = [{ slidesNumber: 4, maxWidth: 1600 }]
//     expect(returnCountSlides(config, 800, 2)).toBe(4)
//   })
//   it('returns default number of slides', () => {
//     expect(returnCountSlides([], 800, 3)).toBe(3)
//   })
// })
// describe('returnSpaceBetween', () => {
//   it('returns custom spaceBetween', () => {
//     const config = [{ slidesNumber: 2, maxWidth: 1200, spaceBetween: 4 }]
//     expect(returnSpaceBetween(config, 800, 2)).toBe(4)
//   })
//   it('returns default spaceBetween', () => {
//     expect(returnSpaceBetween([], 800, 3)).toBe(3)
//   })
// })
(0, vitest_1.describe)('returnSlideWidth', () => {
    (0, vitest_1.it)('returns slide width', () => {
        const mockedRef = {
            current: {
                getBoundingClientRect: () => ({ width: 779 })
            }
        };
        (0, vitest_1.expect)((0, index_1.returnSlideWidth)({
            visibleCountSlides: 2,
            current: mockedRef.current,
            spaceBetween: 0
        })).toBe(389.5);
    });
});
(0, vitest_1.describe)('calculateSlideIndex', () => {
    (0, vitest_1.it)('return slide index', () => {
        const children = [(0, jsx_runtime_1.jsx)("div", {}), (0, jsx_runtime_1.jsx)("div", {}), (0, jsx_runtime_1.jsx)("div", {}), (0, jsx_runtime_1.jsx)("div", {})];
        (0, vitest_1.expect)((0, index_1.calculateSlideIndex)(-778, 390, children)).eq(2);
    });
});
//# sourceMappingURL=helpers.test.js.map