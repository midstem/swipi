"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const helpers_1 = require("../helpers");
const ConfigService = (config, windowWidth) => {
    const getSliderUpdatesParam = (param) => { var _a; return (_a = config.filter((item) => item.maxWidth >= windowWidth).at(-1)) === null || _a === void 0 ? void 0 : _a[param]; };
    const returnCountSlides = (slidesNumber) => getSliderUpdatesParam('slidesNumber') || slidesNumber;
    const returnSpaceBetween = (spaceBetweenSlides) => getSliderUpdatesParam('spaceBetween') || spaceBetweenSlides;
    const getRightSlidesCount = (slidesNumber, animation) => {
        if ((0, helpers_1.isFadeInAnimation)(animation))
            return 1;
        return returnCountSlides(slidesNumber);
    };
    return {
        getSliderUpdatesParam,
        returnCountSlides,
        returnSpaceBetween,
        getRightSlidesCount
    };
};
exports.ConfigService = ConfigService;
//# sourceMappingURL=index.js.map