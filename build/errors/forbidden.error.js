"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiForbidden = void 0;
const custom_error_1 = require("./custom/custom.error");
class ApiForbidden extends custom_error_1.CustomError {
    constructor(stack) {
        super("Forbidden");
        this.statusCode = 403;
        Object.setPrototypeOf(this, ApiForbidden.prototype);
    }
    serializeError() {
        return [{ message: "Forbidden", stack: this.stack }];
    }
}
exports.ApiForbidden = ApiForbidden;
