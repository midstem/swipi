"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fadeIn = void 0;
const fadeIn = (isOpacity) => ({
    opacity: isOpacity ? 1 : 0,
    transition: 'opacity 350ms cubic-bezier(0.25, 1, 0.5, 1) 0s'
});
exports.fadeIn = fadeIn;
//# sourceMappingURL=FadeIn.js.map