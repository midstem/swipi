"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = exports.Field = exports.BooleanValue = exports.Legend = exports.Fieldset = exports.Form = void 0;
const tslib_1 = require("tslib");
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
exports.Form = styled_components_1.default.form `
  margin-top: 40px;

  /* Removes arrows from number input */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    appearance: none;
    -moz-appearance: textfield;
  }
`;
exports.Fieldset = styled_components_1.default.fieldset `
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 20px;
`;
exports.Legend = styled_components_1.default.legend `
  font-size: 22px;
  text-align: center;
`;
exports.BooleanValue = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  div {
    display: flex;
    gap: 10px;
  }

  p {
    margin: 0;
  }
`;
exports.Field = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  gap: 20px;

  & > div {
    display: flex;
    gap: 5px;
  }
`;
exports.TextInput = styled_components_1.default.input `
  border: none;
  border-bottom: 1px solid black;
  outline: none;
`;
//# sourceMappingURL=styles.js.map