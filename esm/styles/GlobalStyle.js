"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const styled = tslib_1.__importStar(require("styled-components"));
const GlobalStyle = styled.createGlobalStyle `
  #root {
    display: flex;
    justify-content: center;
  }

  label {
    cursor: pointer;
  }
`;
exports.default = GlobalStyle;
//# sourceMappingURL=GlobalStyle.js.map