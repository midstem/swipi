"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoplay = void 0;
const react_1 = require("react");
const helpers_1 = require("../../helpers");
const useAutoplay = ({ autoplay, autoplaySpeed, slideIndex, nextImg, timeout }) => {
    (0, react_1.useEffect)(() => {
        if (!autoplay)
            return;
        clearTimeout(timeout.current);
        (0, helpers_1.startAutoplay)(autoplaySpeed, timeout, nextImg);
        return clearTimeout(timeout.current);
    }, [autoplaySpeed, autoplay, slideIndex, nextImg, timeout]);
};
exports.useAutoplay = useAutoplay;
//# sourceMappingURL=index.js.map