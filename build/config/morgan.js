"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorganErrorHandler = exports.MorganSuccessHandler = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./logger");
morgan_1.default.token("message", (req, res) => res.locals.errorMessage || "");
const getIpFormat = () => process.env.NODE_ENV === "production" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
const MorganSuccessHandler = (0, morgan_1.default)(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger_1.Logger.info(message.trim()) },
});
exports.MorganSuccessHandler = MorganSuccessHandler;
const MorganErrorHandler = (0, morgan_1.default)(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => logger_1.Logger.error(message.trim()) },
});
exports.MorganErrorHandler = MorganErrorHandler;
