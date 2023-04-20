"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Dot_1 = tslib_1.__importDefault(require("../../UI/Dot"));
const DotsWrapper_1 = tslib_1.__importDefault(require("../../UI/DotsWrapper"));
const Default = ({ children, slideIndex, customDot, customActiveDot, sizeForDefaultDot, sizeForDefaultActiveDot, dotColor, activeDotColor, handleDotClick, returnDots }) => ((0, jsx_runtime_1.jsx)(DotsWrapper_1.default, { children: children.map((_, index) => ((0, jsx_runtime_1.jsx)("div", Object.assign({ onClick: () => {
            handleDotClick(index);
        } }, { children: customDot || customActiveDot ? (returnDots(index)) : ((0, jsx_runtime_1.jsx)(Dot_1.default, { index: index, slideIndex: slideIndex, sizeForDefaultDot: sizeForDefaultDot, sizeForDefaultActiveDot: sizeForDefaultActiveDot, dotColor: dotColor, activeDotColor: activeDotColor })) }), index))) }));
exports.default = Default;
//# sourceMappingURL=index.js.map