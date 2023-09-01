"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
const interface_1 = require("./entity/interface");
class Validation {
    constructor() { }
    create() {
        return {
            body: joi_1.default.object()
                .keys({
                subscription: joi_1.default.string()
                    .custom(customeValidation_1.objectId)
                    .required()
                    .description('subscription id is required'),
                paymentMethod: joi_1.default.string()
                    .required()
                    .description('payment method is required'),
                transactionHash: joi_1.default.string()
                    .required()
                    .description('transaction hash is required'),
                //   status: Joi.string()
                //     .valid(...Object.keys(CryptoPaymentStatus))
                //     .required(),
            })
                .min(3)
                .max(3),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                status: joi_1.default.string().valid(...Object.keys(interface_1.CryptoPaymentStatus)),
                user: joi_1.default.string().custom(customeValidation_1.objectId),
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
                status: joi_1.default.string().valid('Approve', 'Reject').required(),
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
}
exports.default = new Validation();
