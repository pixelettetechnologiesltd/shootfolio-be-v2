"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
class Validation {
    constructor() { }
    create() {
        return {
            body: joi_1.default.object()
                .keys({
                gameType: joi_1.default.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
                modeTitle: joi_1.default.string().required(),
                duration: joi_1.default.string().required(),
                status: joi_1.default.bool().required(),
                quiz: joi_1.default.bool().required(),
            })
                .min(5)
                .max(5),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                gameType: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, "").optional(),
            })
                .max(2),
        };
    }
    update() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
            body: joi_1.default.object().keys({
                gameType: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
                modeTitle: joi_1.default.string(),
                duration: joi_1.default.string(),
                status: joi_1.default.bool(),
                quiz: joi_1.default.bool(),
            }),
        };
    }
    get() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
    delete() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
}
exports.default = new Validation();
