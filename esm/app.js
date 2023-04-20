"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Slider_1 = tslib_1.__importDefault(require("./Slider"));
const DotsForm_1 = tslib_1.__importDefault(require("./components/DotsForm"));
const SlidesForm_1 = tslib_1.__importDefault(require("./components/SlidesForm"));
const constants_1 = require("./constants");
const styles_1 = require("./styles");
const unicorn_svg_1 = require("./assets/unicorn.svg");
require("./styles/normalize.css");
const App = () => {
    const [showDots, setShowDots] = (0, react_1.useState)(false);
    const [sizeForDefaultDot, setSizeForDefaultDot] = (0, react_1.useState)(0);
    const [sizeForDefaultActiveDot, setSizeForDefaultActiveDot] = (0, react_1.useState)(0);
    const [dotColor, setDotColor] = (0, react_1.useState)('');
    const [activeDotColor, setActiveDotColor] = (0, react_1.useState)('');
    const [dotsAnimation, setDotsAnimation] = (0, react_1.useState)('');
    const [customDot, setCustomDot] = (0, react_1.useState)('none');
    const [customActiveDot, setCustomActiveDot] = (0, react_1.useState)('none');
    const [slidesNumber, setSlidesNumber] = (0, react_1.useState)(0);
    const [spaceBetweenSlides, setSpaceBetweenSlides] = (0, react_1.useState)(0);
    const [animationSpeed, setAnimationSpeed] = (0, react_1.useState)(0);
    const [autoplay, setAutoplay] = (0, react_1.useState)(false);
    const [autoplaySpeed, setAutoplaySpeed] = (0, react_1.useState)(0);
    const [slidesAnimation, setSlidesAnimation] = (0, react_1.useState)('none');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Slider_1.default, Object.assign({ showDots: showDots, sizeForDefaultDot: sizeForDefaultDot === 0 ? undefined : sizeForDefaultDot, sizeForDefaultActiveDot: sizeForDefaultActiveDot === 0 ? undefined : sizeForDefaultActiveDot, dotColor: dotColor === '' ? undefined : dotColor, activeDotColor: activeDotColor === '' ? undefined : activeDotColor, dotsAnimation: dotsAnimation === '' ? undefined : dotsAnimation, customDot: customDot === 'none' ? undefined : customDot === 'circle' ? ((0, jsx_runtime_1.jsx)(styles_1.Dot, {})) : ((0, jsx_runtime_1.jsx)(unicorn_svg_1.ReactComponent, {})), customActiveDot: customActiveDot === 'none' ? undefined : customActiveDot ===
                    'red-unicorn' ? ((0, jsx_runtime_1.jsx)(unicorn_svg_1.ReactComponent, { style: { fill: 'red' } })) : ((0, jsx_runtime_1.jsx)(styles_1.ActiveDot, {})), slidesNumber: slidesNumber === 0 ? undefined : slidesNumber, spaceBetweenSlides: spaceBetweenSlides === 0 ? undefined : spaceBetweenSlides, animationSpeed: animationSpeed === 0 ? undefined : animationSpeed, autoplay: autoplay, autoplaySpeed: autoplaySpeed === 0 ? undefined : autoplaySpeed, slidesAnimation: slidesAnimation === ''
                    ? undefined
                    : slidesAnimation }, { children: constants_1.dives.map((div) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: div.element }))) })), (0, jsx_runtime_1.jsx)(DotsForm_1.default, { showDots: showDots, sizeForDefaultDot: sizeForDefaultDot, customDot: customDot, customActiveDot: customActiveDot, setShowDots: setShowDots, setSizeForDefaultDot: setSizeForDefaultDot, setSizeForDefaultActiveDot: setSizeForDefaultActiveDot, setDotColor: setDotColor, setActiveDotColor: setActiveDotColor, setDotsAnimation: setDotsAnimation, setCustomDot: setCustomDot, setCustomActiveDot: setCustomActiveDot }), (0, jsx_runtime_1.jsx)(SlidesForm_1.default, { autoplay: autoplay, setSlidesNumber: setSlidesNumber, setSpaceBetweenSlides: setSpaceBetweenSlides, setAnimationSpeed: setAnimationSpeed, setAutoplay: setAutoplay, setAutoplaySpeed: setAutoplaySpeed, setSlidesAnimation: setSlidesAnimation })] }));
};
exports.default = App;
//# sourceMappingURL=app.js.map