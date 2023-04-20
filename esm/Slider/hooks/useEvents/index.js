"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvents = void 0;
const react_1 = require("react");
const helpers_1 = require("../../helpers");
const useEvents = ({ isButton, transform, slideWidth, startTransform, children, setAnimation, setTransform, setSlideIndex, checkSliderCorner, checkAreaBeyondSlider, jumpToTheLastSlide, moveSlides, setStartX, setEndX, setMovePath }) => {
    const [mouseDown, setMouseDown] = (0, react_1.useState)(false);
    const resetCoordinates = () => {
        setEndX(0);
        setMovePath(0);
        setStartX(0);
    };
    const turnInitialPosition = () => {
        setAnimation(false);
        setTransform((prev) => (prev ? prev - startTransform : startTransform));
    };
    const onSwipe = () => {
        setTransform((prev) => Math.round(prev / slideWidth) * slideWidth);
    };
    const onStart = (X) => {
        checkSliderCorner() && turnInitialPosition();
        setStartX(X);
        setMouseDown(true);
    };
    const onMove = (X) => {
        if (!mouseDown)
            return;
        setAnimation(false);
        moveSlides();
        setEndX(X);
        setSlideIndex((0, helpers_1.calculateSlideIndex)(transform, slideWidth, children));
    };
    const onEnd = () => {
        setAnimation(true);
        onSwipe();
        checkAreaBeyondSlider() && jumpToTheLastSlide();
        resetCoordinates();
        setMouseDown(false);
    };
    return {
        onStart: isButton ? onStart : () => { },
        onMove: isButton ? onMove : () => { },
        onEnd
    };
};
exports.useEvents = useEvents;
//# sourceMappingURL=index.js.map