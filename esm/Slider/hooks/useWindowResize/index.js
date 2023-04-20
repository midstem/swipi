"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowResize = void 0;
const react_1 = require("react");
const useWindowResize = (callback) => {
    const resizeHandler = (0, react_1.useCallback)(callback, [callback]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);
};
exports.useWindowResize = useWindowResize;
//# sourceMappingURL=index.js.map