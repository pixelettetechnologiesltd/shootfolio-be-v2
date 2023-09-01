"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const custom_error_1 = require("./custom/custom.error");
class BadRequestError extends custom_error_1.CustomError {
    constructor(message, stack = "") {
        super(message);
        this.message = message;
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeError() {
        return [{ message: this.message, stack: this.stack }];
    }
}
exports.BadRequestError = BadRequestError;
