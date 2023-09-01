"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const customeValidation_1 = require("../../common/customeValidation");
class AdminValidation {
    constructor() { }
    register() {
        return {
            body: joi_1.default.object().keys({
                userName: joi_1.default.string(),
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().required(),
                role: joi_1.default.string().optional(),
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
    queryAdmin() {
        return {
            query: joi_1.default.object()
                .keys({
                limit: joi_1.default.number().optional(),
                page: joi_1.default.number().optional(),
            })
                .max(2),
        };
    }
    updateAdmin() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
            body: joi_1.default.object()
                .keys({
                email: joi_1.default.string().custom(customeValidation_1.password).optional(),
                userName: joi_1.default.string().custom(customeValidation_1.password).optional(),
                password: joi_1.default.string().custom(customeValidation_1.password).optional(),
                name: joi_1.default.string().optional(),
                role: joi_1.default.string(),
            })
                .min(0)
                .max(5),
        };
    }
    getAdminById() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
            })
                .min(1)
                .max(1),
        };
    }
    deleteAdmin() {
        return {
            params: joi_1.default.object()
                .keys({
                id: joi_1.default.string().custom(customeValidation_1.objectId).required(),
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
}
exports.default = new AdminValidation();
