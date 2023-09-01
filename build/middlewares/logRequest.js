"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
function default_1(req, res, next) {
    logger_1.Logger.info(`Request URL: ${req.url}`);
    logger_1.Logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    next();
}
exports.default = default_1;
