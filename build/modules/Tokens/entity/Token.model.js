"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const token_interface_1 = require("./token.interface");
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: token_interface_1.TokenTypes,
        required: true,
    },
    expires: {
        type: String,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
    timestamps: true,
});
tokenSchema.statics.build = (attrs) => {
    return new Token(attrs);
};
const Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;
