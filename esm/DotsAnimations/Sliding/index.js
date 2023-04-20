"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const ActiveDot_1 = tslib_1.__importDefault(require("../../UI/ActiveDot"));
const Dot_1 = tslib_1.__importDefault(require("../../UI/Dot"));
const DotsWrapper_1 = tslib_1.__importDefault(require("../../UI/DotsWrapper"));
const useSliding_1 = tslib_1.__importDefault(require("./useSliding"));
const Sliding = ({ children, customDot, slideIndex, customActiveDot, dotColor, sizeForDefaultDot, sizeForDefaultActiveDot, activeDotColor, animationSpeed, handleDotClick }) => {
    const { dotsRef, activeDotRef, activeDotLeft } = (0, useSliding_1.default)(slideIndex);
    return ((0, jsx_runtime_1.jsxs)(DotsWrapper_1.default, { children: [children.map((_, index) => ((0, jsx_runtime_1.jsx)("div", Object.assign({ ref: (el) => (dotsRef.current[index] = el), onClick: () => {
                    handleDotClick(index);
                }, style: {
                    transition: `${animationSpeed}ms`,
                    transform: slideIndex === index ? 'scale(0)' : 'scale(1)'
                } }, { children: customDot !== null && customDot !== void 0 ? customDot : ((0, jsx_runtime_1.jsx)(Dot_1.default, { index: index, dotColor: dotColor, sizeForDefaultDot: sizeForDefaultDot })) }), index))), (0, jsx_runtime_1.jsx)("div", Object.assign({ ref: activeDotRef, style: {
                    position: 'absolute',
                    left: activeDotLeft,
                    transition: `left ${animationSpeed}ms`
                } }, { children: customActiveDot !== null && customActiveDot !== void 0 ? customActiveDot : ((0, jsx_runtime_1.jsx)(ActiveDot_1.default, { sizeForDefaultActiveDot: sizeForDefaultActiveDot, activeDotColor: activeDotColor })) }))] }));
};
exports.default = Sliding;
//# sourceMappingURL=index.js.map