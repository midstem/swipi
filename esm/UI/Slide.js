"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Slide = ({ slideWidth, spaceBetween, children, animation = {} }) => {
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: Object.assign({ boxSizing: 'border-box', width: `${slideWidth}px`, paddingRight: `${spaceBetween}px` }, animation) }, { children: children })));
};
exports.Slide = Slide;
//# sourceMappingURL=Slide.js.map