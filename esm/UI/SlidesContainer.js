"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SlidesContainer = ({ children, transform, animation, animationSpeed }) => {
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const startDragging = () => setIsDragging(true);
    const stopDragging = () => setIsDragging(false);
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ onDragStart: (e) => {
            e.preventDefault();
        }, onMouseDown: startDragging, onMouseUp: stopDragging, onMouseLeave: stopDragging, style: {
            display: 'flex',
            width: 'fit-content',
            transform: `translate3d(${transform}px, 0, 0)`,
            transition: `${animation ? `all ${animationSpeed}ms ease-out 0s` : `0s`}`,
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab'
        } }, { children: children })));
};
exports.default = SlidesContainer;
//# sourceMappingURL=SlidesContainer.js.map