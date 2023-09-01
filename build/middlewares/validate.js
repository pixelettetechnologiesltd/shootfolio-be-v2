"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
const joi_1 = __importDefault(require("joi"));
const requestValidation_error_1 = require("../errors/requestValidation.error");
const pick_1 = require("../utils/pick");
const Validate = (schema) => (req, res, next) => {
    let data = Object.assign({}, req.body);
    if (req.headers["content-type"] !== "application/json")
        if (Object.keys(data).length > 0) {
            for (let key in data) {
                try {
                    data[key] = JSON.parse(data[key]);
                }
                catch (error) {
                    continue;
                }
            }
        }
    req.body = data;
    const validSchema = (0, pick_1.Pick)(schema, ["params", "query", "body"]);
    const object = (0, pick_1.Pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .options({ abortEarly: false })
        .prefs({
        errors: { label: "key" },
    })
        .validate(object);
    if (error) {
        const errorMessage = error.details.map((details) => {
            return {
                message: details.message,
                path: details.path[1],
            };
        });
        // @ts-ignore
        return next(new requestValidation_error_1.RequestValidationError(errorMessage));
    }
    Object.assign(req, value);
    return next();
};
exports.Validate = Validate;
