"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = () => {
    return Math.random().toString(36).slice(2);
};
exports.generateToken = generateToken;
