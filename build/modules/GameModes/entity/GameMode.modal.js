"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const gameModeSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    subscription: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'Subscription',
        required: true,
        default: null,
    },
    status: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
gameModeSchema.plugin(paginate_1.default);
gameModeSchema.statics.build = (attrs) => {
    return new GameMode(attrs);
};
const GameMode = mongoose_1.default.model('GameMode', gameModeSchema);
exports.default = GameMode;
