"use strict";
/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pick = void 0;
// @ts-ignore
const Pick = (object, keys) => {
    // @ts-ignore
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
exports.Pick = Pick;
