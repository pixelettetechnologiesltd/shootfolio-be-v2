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
                gameTypeId: joi_1.default.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
                title: joi_1.default.string().required(),
                symbol: joi_1.default.string().min(3).max(3).required(),
                status: joi_1.default.boolean().required(),
            })
                .min(4)
                .max(4),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                gameTypeId: joi_1.default.string().custom(customeValidation_1.objectId).optional(),
                status: joi_1.default.boolean().allow().optional(),
            })
                .max(3),
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
                gameTypeId: joi_1.default.string().custom(customeValidation_1.objectId),
                title: joi_1.default.string().optional(),
                logo: joi_1.default.string().optional(),
                symbol: joi_1.default.string().min(3).max(3).optional(),
                status: joi_1.default.boolean().optional(),
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
