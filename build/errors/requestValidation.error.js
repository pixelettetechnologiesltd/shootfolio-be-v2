"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom/custom.error");
class RequestValidationError extends custom_error_1.CustomError {
    constructor(errors) {
        super("Validation Error");
        this.errors = errors;
        this.statusCode = 400;
        //Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeError() {
        return this.errors.map((err) => {
            return { message: err.message, feild: err.path };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
