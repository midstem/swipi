"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSlides = void 0;
const react_1 = require("react");
const configService_1 = require("../../configService");
const helpers_1 = require("../../helpers");
const helpers_2 = require("../../../helpers");
const constants_1 = require("../../constants");
const useSlides = ({ children, config, windowWidth, currentRef, slidesNumber, spaceBetweenSlides, startX, endX, movePath, setMovePath, slidesAnimation }) => {
    const [transform, setTransform] = (0, react_1.useState)(0);
    const { returnSpaceBetween, getSliderUpdatesParam, getRightSlidesCount } = (0, configService_1.ConfigService)(config, windowWidth);
    const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation);
    const spaceBetween = returnSpaceBetween(spaceBetweenSlides);
    const isButton = (0, helpers_1.isButtonFn)(children, visibleCountSlides);
    const isCornerSlide = !!getSliderUpdatesParam('biasRight');
    const returnSlideWidthArgs = (0, react_1.useMemo)(() => ({
        visibleCountSlides,
        spaceBetween,
        current: currentRef
    }), [currentRef, spaceBetween, visibleCountSlides]);
    const slideWidth = (0, react_1.useMemo)(() => isCornerSlide
        ? (0, helpers_1.returnSlideWidth)(returnSlideWidthArgs) * constants_1.reduceSlide
        : (0, helpers_1.returnSlideWidth)(returnSlideWidthArgs), [returnSlideWidthArgs, isCornerSlide]);
    const slides = (0, react_1.useMemo)(() => isButton
        ? (0, helpers_1.addUniqueId)((0, helpers_2.cloneArray)((0, helpers_1.setKeyToChildren)(children), 3))
        : (0, helpers_1.addUniqueId)((0, helpers_1.setKeyToChildren)(children)), [isButton, children]);
    const startTransform = -slideWidth * children.length;
    const checkAreaBeyondSlider = () => transform <= startTransform * 2 - slideWidth || transform >= slideWidth / 2;
    const moveSlides = () => {
        const pathTaken = endX && startX - endX;
        setTransform((prev) => prev - pathTaken + movePath);
        setMovePath(pathTaken);
    };
    const jumpToTheLastSlide = () => {
        const lineLengthOfSlides = slideWidth * slides.length;
        const numberOfSlidesBack = visibleCountSlides === 1 ? 2 : visibleCountSlides;
        const rightJump = -(lineLengthOfSlides - slideWidth * numberOfSlidesBack);
        setTransform(movePath > 0 ? rightJump : 0);
    };
    return {
        transform,
        setTransform,
        slideWidth,
        spaceBetween,
        isButton,
        slides,
        checkAreaBeyondSlider,
        jumpToTheLastSlide,
        moveSlides,
        startTransform
    };
};
exports.useSlides = useSlides;
//# sourceMappingURL=index.js.map