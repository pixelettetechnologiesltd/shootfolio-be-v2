"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custom_error_1 = require("./custom/custom.error");
class DatabaseConnectionError extends custom_error_1.CustomError {
    constructor(stack) {
        super("Database connection error");
        this.statusCode = 500;
        this.reaseon = "Error connecting database";
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeError() {
        return [
            {
                message: this.message,
                stack: this.stack,
            },
        ];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
