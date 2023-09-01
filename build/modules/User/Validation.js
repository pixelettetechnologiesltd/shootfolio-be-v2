"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
class UserValidation {
    constructor() { }
    register() {
        return {
            body: joi_1.default.object().keys({
                userName: joi_1.default.string().required(),
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().required(),
                walletAddress: joi_1.default.string().optional(),
                role: joi_1.default.string().optional(),
            }),
        };
    }
    socialLogin() {
        return {
            body: joi_1.default.object().keys({
                userName: joi_1.default.string().required(),
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                // password: Joi.string().required(),
                // walletAddress: Joi.string().optional(),
                // role: Joi.string().optional(),
            }),
        };
    }
    login() {
        return {
            body: joi_1.default.object().keys({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().required(),
            }),
        };
    }
    logout() {
        return {
            body: joi_1.default.object().keys({
                refreshToken: joi_1.default.string().required(),
            }),
        };
    }
    queryUsers() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
            })
                .max(2),
        };
    }
    updateUser() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
            body: joi_1.default.object()
                .keys({
                userName: joi_1.default.string().optional(),
                password: joi_1.default.string().custom(customeValidation_1.password).optional(),
                name: joi_1.default.string().optional(),
                email: joi_1.default.string().email().optional(),
                photoPath: joi_1.default.string().optional(),
                deviceToken: joi_1.default.array(),
                role: joi_1.default.string(),
            })
                .min(0)
                .max(6),
        };
    }
    getUserById() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
    deleteUser() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
    addDeviceToken() {
        return {
            body: joi_1.default.object()
                .keys({
                token: joi_1.default.string().required(),
            })
                .min(1)
                .max(1),
        };
    }
    changePassword() {
        return {
            body: joi_1.default.object().keys({
                email: joi_1.default.string().email().required(),
                oldPassword: joi_1.default.string().required(),
                newPassword: joi_1.default.string().required(),
            }),
        };
    }
    forgotPassword() {
        return {
            body: joi_1.default.object().keys({
                email: joi_1.default.string().email().required(),
            }),
        };
    }
    resetPassword() {
        return {
            body: joi_1.default.object().keys({
                email: joi_1.default.string().email().required(),
                otp: joi_1.default.number().required(),
                newPassword: joi_1.default.string().required(),
            }),
        };
    }
    updateUserStatus() {
        return {
            params: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId),
            }),
            body: {
                status: joi_1.default.string().valid('active', 'inactive').required(),
            },
        };
    }
    updateUserByAdmin() {
        return {
            params: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId),
            }),
            body: {
                name: joi_1.default.string().optional(),
                userName: joi_1.default.string().optional(),
            },
        };
    }
    verifyToken() {
        return {
            params: joi_1.default.object().keys({
                token: joi_1.default.string().required(),
            }),
        };
    }
    updateSubscription() {
        return {
            params: joi_1.default.object().keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId),
            }),
            body: joi_1.default.object()
                .keys({
                subscriptionId: joi_1.default.string().custom(customeValidation_1.objectId),
            })
                .min(1)
                .max(1),
        };
    }
}
exports.default = new UserValidation();
