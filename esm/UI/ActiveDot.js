"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ActiveDot = ({ sizeForDefaultActiveDot = 13, activeDotColor }) => ((0, jsx_runtime_1.jsx)("div", { style: {
        aspectRatio: '1 / 1',
        width: `${sizeForDefaultActiveDot}px`,
        backgroundColor: activeDotColor || 'black',
        borderRadius: '50%',
        cursor: 'pointer'
    } }));
exports.default = ActiveDot;
//# sourceMappingURL=ActiveDot.js.map