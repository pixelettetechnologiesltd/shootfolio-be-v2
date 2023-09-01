"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
const subscription_interface_1 = require("./entity/subscription.interface");
class SubscriptionValidation {
    constructor() { }
    create() {
        return {
            body: joi_1.default.object().keys({
                name: joi_1.default.string()
                    .valid(...Object.keys(subscription_interface_1.SubscriptionTypes))
                    .required(),
                leagues: joi_1.default.array().items(joi_1.default.string().custom(customeValidation_1.objectId)),
                amount: joi_1.default.number().required(),
            }),
        };
    }
    subscribe() {
        return {
            body: joi_1.default.object().keys({
                subscriptionId: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            }),
        };
    }
    upgradeSubscription() {
        return {
            body: joi_1.default.object().keys({
                subscriptionId: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            }),
        };
    }
    querySubscription() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
            })
                .max(6),
        };
    }
    update() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().required(),
            })
                .min(1)
                .max(1),
            body: joi_1.default.object().keys({
                name: joi_1.default.string(),
                leagues: joi_1.default.array().items(joi_1.default.string().custom(customeValidation_1.objectId)),
                amount: joi_1.default.number(),
            }),
        };
    }
    getSubscription() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().required(),
            })
                .min(1)
                .max(1),
        };
    }
    deleteSubscription() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().required(),
            })
                .min(1)
                .max(1),
        };
    }
}
exports.default = new SubscriptionValidation();
