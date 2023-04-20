"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDotsLeftOffsets = exports.getWidthDifference = void 0;
const getWidthDifference = (dotWidth, activeDotWidth) => (dotWidth - activeDotWidth) / 2;
exports.getWidthDifference = getWidthDifference;
const getDotsLeftOffsets = (dotsRef) => {
    var _a;
    return (_a = dotsRef.current) === null || _a === void 0 ? void 0 : _a.map((dot) => {
        var _a;
        return ({
            left: (_a = dot === null || dot === void 0 ? void 0 : dot.offsetLeft) !== null && _a !== void 0 ? _a : 0
        });
    });
};
exports.getDotsLeftOffsets = getDotsLeftOffsets;
//# sourceMappingURL=helpers.js.map