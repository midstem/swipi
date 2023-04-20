"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Dot = ({ index, slideIndex, sizeForDefaultDot = 12, sizeForDefaultActiveDot = 12, dotColor = '#c7c7c7', activeDotColor = 'black' }) => ((0, jsx_runtime_1.jsx)("div", { style: {
        aspectRatio: '1 / 1',
        width: slideIndex === index ? sizeForDefaultActiveDot : sizeForDefaultDot,
        backgroundColor: slideIndex === index ? activeDotColor : dotColor,
        borderRadius: '50%',
        cursor: 'pointer'
    } }));
exports.default = Dot;
//# sourceMappingURL=Dot.js.map