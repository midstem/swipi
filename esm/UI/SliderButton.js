"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SliderButton = (0, react_1.forwardRef)(({ children, onClick, className }, ref) => ((0, jsx_runtime_1.jsx)("button", Object.assign({ className: className, ref: ref, onClick: onClick, type: "button", style: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none'
    } }, { children: children }))));
exports.default = SliderButton;
//# sourceMappingURL=SliderButton.js.map