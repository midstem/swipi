"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveDot = exports.Dot = exports.Wrapper = void 0;
const tslib_1 = require("tslib");
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
exports.Wrapper = styled_components_1.default.div `
  width: min(90vw, 1000px);
  margin-top: 20px;

  svg {
    height: 30px;
    width: 30px;
    fill: black;
  }
`;
exports.Dot = styled_components_1.default.div `
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`;
exports.ActiveDot = styled_components_1.default.div `
  height: 13px;
  width: 13px;
  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
`;
//# sourceMappingURL=styles.js.map