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
                gameTitle: joi_1.default.string().required(),
                status: joi_1.default.string()
                    .valid(...Object.keys(interface_1.GameTypeStatus))
                    .required(),
            })
                .min(2)
                .max(2),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                status: joi_1.default.string().valid(...Object.keys(interface_1.GameTypeStatus)),
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
                iconUrl: joi_1.default.string().valid(null, "").allow().optional(),
                gameTitle: joi_1.default.string(),
                status: joi_1.default.string().valid(...Object.keys(interface_1.GameTypeStatus)),
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
