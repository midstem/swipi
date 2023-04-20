"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = tslib_1.__importDefault(require("react-dom/client"));
const app_1 = tslib_1.__importDefault(require("./app"));
const GlobalStyle_1 = tslib_1.__importDefault(require("./styles/GlobalStyle"));
const styles_1 = require("./styles");
// import { ReactComponent as ArrowLeft } from './assets/chevron-left.svg'
// import { ReactComponent as ArrowRight } from './assets/chevron-right.svg'
const root = client_1.default.createRoot(document.getElementById('root'));
// const mediaSettings = [
//   { maxWidth: 2200, slidesNumber: 3, spaceBetween: 5 },
//   { maxWidth: 1400, slidesNumber: 2, spaceBetween: 4 },
//   { maxWidth: 900, slidesNumber: 1, spaceBetween: 2 }
// ]
root.render((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GlobalStyle_1.default, {}), (0, jsx_runtime_1.jsx)(styles_1.Wrapper, { children: (0, jsx_runtime_1.jsx)(app_1.default, {}) })] }));
//# sourceMappingURL=index.js.map