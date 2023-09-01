"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
class Validation {
    constructor() { }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
            })
                .max(3),
        };
    }
    // public update() {
    //   return {
    //     params: Joi.object()
    //       .keys({
    //         id: Joi.string().custom(objectId).required(),
    //       })
    //       .min(1)
    //       .max(1),
    //     body: Joi.object().keys({
    //       iconUrl: Joi.string().valid(null, "").allow().optional(),
    //       gameTitle: Joi.string(),
    //       status: Joi.string().valid(...Object.keys(GameTypeStatus)),
    //     }),
    //   };
    // }
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
