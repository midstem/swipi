"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANIMATIONS = exports.reduceSlide = exports.defaultSliderWidth = void 0;
const tslib_1 = require("tslib");
const Default_1 = tslib_1.__importDefault(require("../DotsAnimations/Default"));
const Sliding_1 = tslib_1.__importDefault(require("../DotsAnimations/Sliding"));
exports.defaultSliderWidth = 934;
exports.reduceSlide = 0.75;
exports.ANIMATIONS = {
    default: Default_1.default,
    sliding: Sliding_1.default
};
//# sourceMappingURL=constants.js.map