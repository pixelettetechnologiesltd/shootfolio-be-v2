"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const config_1 = __importDefault(require("../../../config/config"));
const interface_1 = require("./interface");
const Schema = new mongoose_1.default.Schema({
    iconUrl: {
        type: String,
        required: true,
    },
    gameTitle: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: interface_1.GameTypeStatus,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.updatedAt;
            if (ret.iconUrl) {
                ret.iconUrl = config_1.default.rootPath + ret.iconUrl;
            }
        },
    },
    timestamps: true,
});
Schema.plugin(paginate_1.default);
Schema.statics.build = (attrs) => {
    return new GameType(attrs);
};
const GameType = mongoose_1.default.model("GameType", Schema);
exports.default = GameType;
