"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Slide_1 = require("../UI/Slide");
const helpers_1 = require("./helpers");
const useSlider_1 = require("./useSlider");
const SliderContainer_1 = tslib_1.__importDefault(require("../UI/SliderContainer"));
const SliderButton_1 = tslib_1.__importDefault(require("../UI/SliderButton"));
const SlidesWrapper_1 = tslib_1.__importDefault(require("../UI/SlidesWrapper"));
const SlidesContainer_1 = tslib_1.__importDefault(require("../UI/SlidesContainer"));
const CarouselWrapper_1 = tslib_1.__importDefault(require("../UI/CarouselWrapper"));
require("../UI/styles.css");
const Slider = ({ slidesNumber = 3, spaceBetweenSlides = 0, nextButton = 'ᐳ', prevButton = 'ᐸ', children = [], config = [], showDots, customDot, customActiveDot, dotColor, activeDotColor, sizeForDefaultDot, sizeForDefaultActiveDot = 13, autoplay = false, autoplaySpeed = 4000, dotsAnimation = 'default', animationSpeed = 300, slidesAnimation = 'default', className }) => {
    const { animation, transform, slideWidth, slidesWrapperRef, slides, isButton, spaceBetween, slideIndex, Dots, handleDotClick, nextImg, prevImg, onEnd, returnDots, onMove, onStart } = (0, useSlider_1.useSlider)({
        children,
        config,
        customActiveDot,
        customDot,
        slidesNumber,
        spaceBetweenSlides,
        autoplay,
        autoplaySpeed,
        dotsAnimation,
        dotColor,
        activeDotColor,
        slidesAnimation
    });
    return ((0, jsx_runtime_1.jsxs)(CarouselWrapper_1.default, Object.assign({ className: className }, { children: [(0, jsx_runtime_1.jsxs)(SliderContainer_1.default, { children: [(0, jsx_runtime_1.jsx)(SliderButton_1.default, Object.assign({ onClick: prevImg, className: "left-button" }, { children: isButton && prevButton })), (0, jsx_runtime_1.jsx)(SlidesWrapper_1.default, Object.assign({ slidesWrapperRef: slidesWrapperRef, startTouchByScreen: onStart, moveTouchScreen: onMove, endTouchScreen: onEnd }, { children: (0, jsx_runtime_1.jsx)(SlidesContainer_1.default, Object.assign({ animation: animation, transform: transform, animationSpeed: animationSpeed }, { children: slides === null || slides === void 0 ? void 0 : slides.map(({ id, key }, index) => ((0, jsx_runtime_1.jsx)(Slide_1.Slide, Object.assign({ slideWidth: slideWidth, spaceBetween: spaceBetween, animation: (0, helpers_1.returnSlidesAnimation)(slidesAnimation, key === slideIndex) }, { children: slides[index] }), id))) })) })), (0, jsx_runtime_1.jsx)(SliderButton_1.default, Object.assign({ onClick: nextImg, className: "left-button" }, { children: isButton && nextButton }))] }), showDots && ((0, jsx_runtime_1.jsx)(Dots, { children: children, customDot: customDot, customActiveDot: customActiveDot, slideIndex: slideIndex, sizeForDefaultDot: sizeForDefaultDot, sizeForDefaultActiveDot: sizeForDefaultActiveDot, activeDotColor: activeDotColor, dotColor: dotColor, animationSpeed: animationSpeed, handleDotClick: handleDotClick, returnDots: returnDots }))] })));
};
exports.default = Slider;
//# sourceMappingURL=index.js.map