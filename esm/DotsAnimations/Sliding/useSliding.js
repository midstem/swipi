"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const useSliding = (slideIndex) => {
    const dotsRef = (0, react_1.useRef)([]);
    const activeDotRef = (0, react_1.useRef)(null);
    const [activeDotLeft, setActiveDotLeft] = (0, react_1.useState)(0);
    const [dotWidth, setDotWidth] = (0, react_1.useState)(0);
    const [activeDotWidth, setActiveDotWidth] = (0, react_1.useState)(0);
    //prettier-ignore
    const [dotsLeftOffsets, setDotsLeftOffsets] = (0, react_1.useState)(constants_1.defaultDotsLeftOffsets);
    const initializeData = () => {
        var _a, _b, _c, _d;
        setDotsLeftOffsets((0, helpers_1.getDotsLeftOffsets)(dotsRef));
        setDotWidth((_b = (_a = dotsRef.current[0]) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0);
        setActiveDotWidth((_d = (_c = activeDotRef.current) === null || _c === void 0 ? void 0 : _c.clientWidth) !== null && _d !== void 0 ? _d : 0);
    };
    const moveActiveDot = (0, react_1.useCallback)(() => {
        const activeDotIndent = dotsLeftOffsets[slideIndex].left;
        const dotAlignment = (0, helpers_1.getWidthDifference)(dotWidth, activeDotWidth);
        if (!slideIndex)
            return setActiveDotLeft(activeDotIndent + dotAlignment);
        setActiveDotLeft(activeDotIndent + dotAlignment);
    }, [activeDotWidth, dotWidth, dotsLeftOffsets, slideIndex]);
    (0, react_1.useEffect)(() => {
        initializeData();
    }, []);
    (0, react_1.useEffect)(() => {
        moveActiveDot();
    }, [moveActiveDot]);
    return { dotsRef, activeDotRef, activeDotLeft };
};
exports.default = useSliding;
//# sourceMappingURL=useSliding.js.map