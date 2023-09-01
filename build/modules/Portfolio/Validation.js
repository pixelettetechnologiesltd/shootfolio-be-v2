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
            body: joi_1.default.object().keys({
                admin: joi_1.default.string().custom(customeValidation_1.objectId),
                user: joi_1.default.string().custom(customeValidation_1.objectId),
                coin: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                club: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                quantity: joi_1.default.number().required(),
            }),
        };
    }
    query() {
        return {
            query: joi_1.default.object().keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                user: joi_1.default.string().custom(customeValidation_1.objectId),
                admin: joi_1.default.string().custom(customeValidation_1.objectId),
                club: joi_1.default.string().custom(customeValidation_1.objectId),
            }),
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
                admin: joi_1.default.string().custom(customeValidation_1.objectId),
                user: joi_1.default.string().custom(customeValidation_1.objectId),
                coin: joi_1.default.string().custom(customeValidation_1.objectId),
                club: joi_1.default.string().custom(customeValidation_1.objectId),
                quantity: joi_1.default.number(),
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
