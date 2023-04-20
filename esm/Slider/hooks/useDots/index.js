"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDots = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ActiveDot_1 = tslib_1.__importDefault(require("../../../UI/ActiveDot"));
const Dot_1 = tslib_1.__importDefault(require("../../../UI/Dot"));
const helpers_1 = require("../../helpers");
const useDots = ({ setTransform, slideWidth, customActiveDot, customDot, setAnimation, activeDotColor, dotColor }) => {
    const [slideIndex, setSlideIndex] = (0, react_1.useState)(0);
    const handleDotClick = (index) => {
        setAnimation(true);
        setTransform(-index * slideWidth);
        setSlideIndex(index);
    };
    const returnDots = (index) => {
        if (slideIndex === index) {
            return customActiveDot || (0, jsx_runtime_1.jsx)(ActiveDot_1.default, { activeDotColor: activeDotColor });
        }
        return (customDot || ((0, jsx_runtime_1.jsx)(Dot_1.default, { index: index, slideIndex: slideIndex, dotColor: dotColor })));
    };
    const changeDot = (0, react_1.useCallback)((next) => (transform, children) => {
        setSlideIndex((0, helpers_1.calculateSlideIndex)(next ? transform - slideWidth : transform + slideWidth, slideWidth, children));
    }, [slideWidth]);
    return {
        handleDotClick,
        returnDots,
        slideIndex,
        setSlideIndex,
        nextDot: changeDot(true),
        prevDot: changeDot()
    };
};
exports.useDots = useDots;
//# sourceMappingURL=index.js.map