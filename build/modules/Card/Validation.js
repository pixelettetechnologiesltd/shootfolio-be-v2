"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
class CardValidation {
    constructor() { }
    create() {
        return {
            body: joi_1.default.object().keys({
                city: joi_1.default.string(),
                line1: joi_1.default.string(),
                line2: joi_1.default.string(),
                postal_code: joi_1.default.string(),
                state: joi_1.default.string(),
                country: joi_1.default.string(),
                name: joi_1.default.string().required().label('Card holder name is required'),
                number: joi_1.default.string().required(),
                exp_month: joi_1.default.number().required(),
                exp_year: joi_1.default.number().required(),
                cvc: joi_1.default.string().required(),
            }),
        };
    }
    updateCard() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
            body: joi_1.default.object().keys({
                address: joi_1.default.object().keys({
                    city: joi_1.default.string(),
                    line1: joi_1.default.string(),
                    line2: joi_1.default.string(),
                    postal_code: joi_1.default.string(),
                    state: joi_1.default.string(),
                    country: joi_1.default.string(),
                }),
                card: joi_1.default.object().keys({
                    name: joi_1.default.string().required(),
                    number: joi_1.default.string().required(),
                    exp_month: joi_1.default.string().required(),
                    exp_year: joi_1.default.string().required(),
                    cvc: joi_1.default.string().required(),
                }),
            }),
        };
    }
    getCard() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
    deleteCard() {
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
exports.default = new CardValidation();
