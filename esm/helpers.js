"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneArray = exports.generateUniqueID = void 0;
const generateUniqueID = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return characters
        .split('')
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join('');
};
exports.generateUniqueID = generateUniqueID;
const cloneArray = (array, count) => {
    return new Array(count).fill(array).flat();
};
exports.cloneArray = cloneArray;
//# sourceMappingURL=helpers.js.map