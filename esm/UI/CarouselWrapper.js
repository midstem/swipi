"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const CarouselWrapper = (_a) => {
    var { children, className = '' } = _a, props = tslib_1.__rest(_a, ["children", "className"]);
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: `slider ${className}` }, props, { children: children })));
};
exports.default = CarouselWrapper;
//# sourceMappingURL=CarouselWrapper.js.map