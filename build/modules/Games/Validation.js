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
            body: joi_1.default.object().keys({
                rivalClub: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, "").optional(),
                challengerClub: joi_1.default.string()
                    .custom(customeValidation_1.objectId)
                    .allow(null, "")
                    .optional(),
                portfolios: joi_1.default.array()
                    .items(joi_1.default.object().keys({
                    portfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                    quantity: joi_1.default.number().required(),
                    role: joi_1.default.string()
                        .valid(...Object.keys(interface_1.PlayerRoles))
                        .allow(null, "")
                        .optional(),
                }))
                    .required()
                    .max(5),
                gameMode: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                leauge: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                gameId: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, "").optional(),
                club: joi_1.default.string().custom(customeValidation_1.objectId).allow(null, "").optional(),
            }),
        };
    }
    query() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
                user: joi_1.default.string().custom(customeValidation_1.objectId),
                rivalClub: joi_1.default.string().custom(customeValidation_1.objectId),
                challengerClub: joi_1.default.string().custom(customeValidation_1.objectId),
                gameMode: joi_1.default.string().custom(customeValidation_1.objectId),
                status: joi_1.default.string().valid(...Object.keys(interface_1.GameStatus)),
                leauge: joi_1.default.string().custom(customeValidation_1.objectId),
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
    sell() {
        return {
            body: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                portfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                quantity: joi_1.default.number().required(),
                player: joi_1.default.string().valid("rival", "challenger"),
            }),
        };
    }
    changeCoin() {
        return {
            body: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                currentPortfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                newPortfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                quantity: joi_1.default.number().required(),
                player: joi_1.default.string().valid("rival", "challenger"),
            }),
        };
    }
    borrowMoney() {
        return {
            body: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                portfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                amount: joi_1.default.number().required(),
                player: joi_1.default.string().valid("rival", "challenger").required(),
            }),
        };
    }
    passBall() {
        return {
            body: joi_1.default.object()
                .keys({
                gameId: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                portfolio: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                player: joi_1.default.string().valid("rival", "challenger").required(),
            })
                .min(3)
                .max(3),
        };
    }
    tackle() {
        return {
            body: joi_1.default.object().keys({
                gameId: joi_1.default.string().custom(customeValidation_1.objectId).required(),
                player: joi_1.default.string().valid("rival", "challenger").required(),
            }),
        };
    }
}
exports.default = new Validation();
