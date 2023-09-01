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
const Schema = new mongoose_1.default.Schema({
    gameType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "GameType",
        required: true,
    },
    modeTitle: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    quiz: {
        type: Boolean,
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
    return new GameMode(attrs);
};
Schema.pre(["find", "findOne"], function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate("gameType");
        done();
    });
});
const GameMode = mongoose_1.default.model("GameMode", Schema);
exports.default = GameMode;
