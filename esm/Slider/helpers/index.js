"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFadeInAnimation = exports.returnSlidesAnimation = exports.setKeyToChildren = exports.isButtonFn = exports.startAutoplay = exports.calculateSlideIndex = exports.returnSlideWidth = exports.addUniqueId = exports.getSliderWidth = void 0;
const helpers_1 = require("../../helpers");
const types_1 = require("../../types");
const FadeIn_1 = require("../../SlidesAnimation/FadeIn");
const constants_1 = require("../constants");
const getSliderWidth = (current) => { var _a; return (_a = current === null || current === void 0 ? void 0 : current.getBoundingClientRect().width) !== null && _a !== void 0 ? _a : constants_1.defaultSliderWidth; };
exports.getSliderWidth = getSliderWidth;
const addUniqueId = (slides) => slides.map((slide) => (Object.assign(Object.assign({}, slide), { id: (0, helpers_1.generateUniqueID)() })));
exports.addUniqueId = addUniqueId;
const returnSlideWidth = ({ visibleCountSlides, current, spaceBetween }) => ((0, exports.getSliderWidth)(current) + spaceBetween) / visibleCountSlides;
exports.returnSlideWidth = returnSlideWidth;
const calculateSlideIndex = (transform, slideWidth, children) => {
    const result = Math.round(Math.abs(transform / slideWidth));
    return Math.abs(result % children.length);
};
exports.calculateSlideIndex = calculateSlideIndex;
const startAutoplay = (autoplaySpeed, timeout, nextImg) => {
    timeout.current = setTimeout(() => {
        nextImg();
    }, autoplaySpeed);
};
exports.startAutoplay = startAutoplay;
const isButtonFn = (children, visibleCountSlides) => children.length > visibleCountSlides;
exports.isButtonFn = isButtonFn;
const setKeyToChildren = (children) => {
    return children.map((child, index) => (Object.assign(Object.assign({}, child), { key: index })));
};
exports.setKeyToChildren = setKeyToChildren;
const returnSlidesAnimation = (animation, isVisible) => {
    switch (animation) {
        case types_1.SlidesAnimation.FADE_IN:
            return (0, FadeIn_1.fadeIn)(isVisible);
        default:
            return {};
    }
};
exports.returnSlidesAnimation = returnSlidesAnimation;
const isFadeInAnimation = (animation) => {
    return animation === types_1.SlidesAnimation.FADE_IN;
};
exports.isFadeInAnimation = isFadeInAnimation;
//# sourceMappingURL=index.js.map