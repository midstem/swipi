"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlider = void 0;
const react_1 = require("react");
const useSlides_1 = require("./hooks/useSlides");
const useDots_1 = require("./hooks/useDots");
const useEvents_1 = require("./hooks/useEvents");
const useNavigation_1 = require("./hooks/useNavigation");
const useAutoplay_1 = require("./hooks/useAutoplay");
const useWindowResize_1 = require("./hooks/useWindowResize");
const constants_1 = require("./constants");
const useSlider = ({ children, config, customActiveDot, customDot, slidesNumber, spaceBetweenSlides, autoplay, autoplaySpeed, dotsAnimation, slidesAnimation, dotColor, activeDotColor }) => {
    const [animation, setAnimation] = (0, react_1.useState)(false);
    const [windowWidth, setWindowWidth] = (0, react_1.useState)(0);
    const [currentRef, setCurrentRef] = (0, react_1.useState)(null);
    const [startX, setStartX] = (0, react_1.useState)(0);
    const [endX, setEndX] = (0, react_1.useState)(0);
    const [movePath, setMovePath] = (0, react_1.useState)(0);
    const slidesWrapperRef = (0, react_1.useRef)(null);
    const timeout = (0, react_1.useRef)();
    const { isButton, setTransform, slideWidth, slides, spaceBetween, transform, startTransform, checkAreaBeyondSlider, jumpToTheLastSlide, moveSlides } = (0, useSlides_1.useSlides)({
        children,
        config,
        windowWidth,
        currentRef,
        slidesNumber,
        spaceBetweenSlides,
        slidesAnimation,
        startX,
        endX,
        movePath,
        setMovePath
    });
    const { handleDotClick, slideIndex, setSlideIndex, returnDots, nextDot, prevDot } = (0, useDots_1.useDots)({
        setTransform,
        slideWidth,
        dotsAnimation,
        customActiveDot,
        customDot,
        setAnimation,
        dotColor,
        activeDotColor
    });
    const checkSliderCorner = (0, react_1.useCallback)(() => transform <= startTransform * 2 + slideWidth / 2 ||
        transform >= -slideWidth / 2, [transform, slideWidth, startTransform]);
    const putInTheInitialPosition = (0, react_1.useCallback)((callback) => {
        setTransform(startTransform);
        setAnimation(false);
        const timer = setTimeout(() => {
            callback === null || callback === void 0 ? void 0 : callback();
            setAnimation(true);
        }, 1);
        return () => clearTimeout(timer);
    }, [startTransform, setAnimation, setTransform]);
    const { onEnd, onMove, onStart } = (0, useEvents_1.useEvents)({
        isButton,
        transform,
        slideWidth,
        startTransform,
        children,
        setAnimation,
        setTransform,
        setSlideIndex,
        checkSliderCorner,
        checkAreaBeyondSlider,
        jumpToTheLastSlide,
        moveSlides,
        setStartX,
        setEndX,
        setMovePath
    });
    const { nextImg, prevImg } = (0, useNavigation_1.useNavigation)({
        putInTheInitialPosition,
        checkSliderCorner,
        setTransform,
        setAnimation,
        slideWidth,
        children
    });
    (0, useAutoplay_1.useAutoplay)({
        autoplay,
        autoplaySpeed,
        slideIndex,
        nextImg: () => nextImg(nextDot),
        timeout
    });
    (0, useWindowResize_1.useWindowResize)(() => {
        setWindowWidth(window.innerWidth);
        setAnimation(false);
        setSlideIndex(0);
        setTransform(0);
    });
    (0, react_1.useEffect)(() => {
        setWindowWidth(window.innerWidth);
        setCurrentRef(slidesWrapperRef.current);
    }, []);
    return {
        animation,
        slides,
        transform,
        slideWidth,
        slidesWrapperRef,
        isButton,
        spaceBetween,
        slideIndex,
        Dots: constants_1.ANIMATIONS[dotsAnimation],
        returnDots,
        nextImg: () => nextImg(nextDot),
        prevImg: () => prevImg(prevDot),
        setTransform,
        setAnimation,
        handleDotClick,
        onEnd,
        onMove,
        onStart
    };
};
exports.useSlider = useSlider;
//# sourceMappingURL=useSlider.js.map