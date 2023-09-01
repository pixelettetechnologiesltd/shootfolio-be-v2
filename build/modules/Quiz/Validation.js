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
                question: joi_1.default.string().required(),
                options: joi_1.default.array().required(),
                correctOption: joi_1.default.number().required(),
            }),
        };
    }
    query() {
        return {
            query: joi_1.default.object().keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
            }),
        };
    }
    answerSubmit() {
        return {
            body: joi_1.default.object().keys({
                questionId: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                answer: joi_1.default.number().max(3).min(0),
            }),
        };
    }
}
exports.default = new Validation();
