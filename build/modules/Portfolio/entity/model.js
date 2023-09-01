"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const interface_1 = require("./interface");
const Schema = new mongoose_1.default.Schema({
    admin: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Admin",
        default: null,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        default: null,
    },
    club: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "GameClub",
        default: null,
    },
    playerType: {
        type: String,
        enum: interface_1.PlayerType,
        default: interface_1.PlayerType.Bot,
    },
    coin: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "CryptoCoins",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
Schema.plugin(paginate_1.default);
Schema.statics.build = (attrs) => {
    return new Portfolio(attrs);
};
Schema.pre(["find", "findOne"], function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate("admin").populate("user").populate("coin").populate("club");
    });
});
const Portfolio = mongoose_1.default.model("Portfolio", Schema);
exports.default = Portfolio;
