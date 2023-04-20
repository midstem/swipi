"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const SlidesWrapper = ({ children, slidesWrapperRef, startTouchByScreen, moveTouchScreen, endTouchScreen }) => ((0, jsx_runtime_1.jsx)("div", Object.assign({ ref: slidesWrapperRef, onTouchStart: (e) => startTouchByScreen(e.touches[0].clientX), onTouchMove: (e) => moveTouchScreen(e.touches[0].clientX), onTouchEnd: endTouchScreen, onMouseDown: (e) => startTouchByScreen(e.clientX), onMouseMove: (e) => moveTouchScreen(e.clientX), onMouseUp: endTouchScreen, onMouseLeave: endTouchScreen, style: {
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    } }, { children: children })));
exports.default = SlidesWrapper;
//# sourceMappingURL=SlidesWrapper.js.map