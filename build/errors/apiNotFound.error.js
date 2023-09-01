"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiNotFoundError = void 0;
const custom_error_1 = require("./custom/custom.error");
class ApiNotFoundError extends custom_error_1.CustomError {
    constructor(stack) {
        super("API not found!");
        this.statusCode = 404;
        Object.setPrototypeOf(this, ApiNotFoundError.prototype);
    }
    serializeError() {
        return [{ message: "API not found!", stack: this.stack }];
    }
}
exports.ApiNotFoundError = ApiNotFoundError;
