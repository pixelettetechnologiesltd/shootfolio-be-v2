"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizeError = void 0;
const custom_error_1 = require("./custom/custom.error");
class NotAuthorizeError extends custom_error_1.CustomError {
    constructor() {
        super("Not Authorize");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizeError.prototype);
    }
    serializeError() {
        return [
            {
                message: "Not Authorize",
            },
        ];
    }
}
exports.NotAuthorizeError = NotAuthorizeError;
