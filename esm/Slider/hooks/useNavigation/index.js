"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigation = void 0;
const useNavigation = ({ putInTheInitialPosition, checkSliderCorner, setTransform, setAnimation, slideWidth, children }) => {
    const navigateSlide = (nextSlide) => (callback) => {
        setTransform((transform) => {
            callback(transform, children);
            return nextSlide ? transform - slideWidth : transform + slideWidth;
        });
        setAnimation(true);
        checkSliderCorner() &&
            putInTheInitialPosition(() => setTransform((transform) => {
                callback(transform, children);
                return nextSlide ? transform - slideWidth : transform + slideWidth;
            }));
    };
    return {
        nextImg: navigateSlide(true),
        prevImg: navigateSlide()
    };
};
exports.useNavigation = useNavigation;
//# sourceMappingURL=index.js.map