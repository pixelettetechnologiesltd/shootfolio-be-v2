"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom/custom.error");
const logger_1 = require("../config/logger");
const errorHandler = (error, req, res, next) => {
    if (error instanceof custom_error_1.CustomError) {
        if (process.env.NODE_ENV == "pod") {
            delete error.stack;
        }
        return res.status(error.statusCode).send({
            errors: error.serializeError(),
        });
    }
    logger_1.Logger.error(error);
    res.status(400).send({
        errors: [{ message: "Something went wrong!" }],
    });
};
exports.errorHandler = errorHandler;
