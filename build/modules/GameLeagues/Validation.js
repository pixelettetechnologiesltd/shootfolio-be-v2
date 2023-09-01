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
                gameModeId: joi_1.default.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
                leagueTitle: joi_1.default.string().required(),
                investableBudget: joi_1.default.number().required(),
                status: joi_1.default.bool().required(),
                borrowAmount: joi_1.default.number().required(),
            })
                .min(6)
                .max(6),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                gameTypeId: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, '').optional(),
                gameModeId: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, '').optional(),
                status: joi_1.default.boolean().allow().optional(),
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
                gameTypeId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
                gameModeId: joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/),
                leagueTitle: joi_1.default.string(),
                investableBudget: joi_1.default.number(),
                status: joi_1.default.bool(),
                borrowAmount: joi_1.default.number(),
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
