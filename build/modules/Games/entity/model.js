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
    rival: {
        type: Object,
        required: true,
    },
    challenger: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    rivalClub: {
        type: mongoose_1.default.Types.ObjectId,
        Object,
        ref: "GameClub",
        required: true,
    },
    challengerClub: {
        type: mongoose_1.default.Types.ObjectId,
        Object,
        ref: "GameClub",
    },
    rivalProtfolios: [
        {
            portfolio: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Portfolio",
            },
            quantity: {
                type: Number,
                default: 0,
            },
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "User",
                default: null,
            },
            balance: {
                type: Number,
                default: 0,
            },
            role: {
                type: String,
                default: null,
            },
            ball: {
                type: Boolean,
                default: false,
            },
            borrowAmount: {
                type: Number,
                default: 0,
            },
        },
    ],
    challengerProtfolios: [
        {
            portfolio: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Portfolio",
            },
            quantity: {
                type: Number,
                default: 0,
            },
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "User",
                default: null,
            },
            balance: {
                type: Number,
                default: 0,
            },
            role: {
                type: String,
                default: null,
            },
            ball: {
                type: Boolean,
                default: false,
            },
            borrowAmount: {
                type: Number,
                default: 0,
            },
        },
    ],
    rivalBalance: {
        type: Number,
        default: 0,
    },
    challengerBalance: {
        type: Number,
        default: 0,
    },
    gameMode: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "GameMode",
        required: true,
    },
    leauge: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "GameLeague",
        required: true,
    },
    status: {
        type: String,
        enum: interface_1.GameStatus,
        required: true,
    },
    rivalGoals: {
        type: Number,
        default: 0,
    },
    challengerGoals: {
        type: Number,
        default: 0,
    },
    winner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["days", "minutes"],
    },
    remainingCamparisons: {
        type: Number,
        default: 0,
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
    return new GameType(attrs);
};
Schema.pre(["find", "findOne"], function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate("challenger")
            .populate("rivalClub")
            .populate("challengerClub")
            .populate("rivalProtfolios.portfolio")
            .populate("rivalProtfolios.user")
            .populate("challengerProtfolios.portfolio")
            .populate("challengerProtfolios.user")
            .populate("gameMode")
            .populate("winner")
            .populate("leauge");
        done();
    });
});
const GameType = mongoose_1.default.model("Games", Schema);
exports.default = GameType;
