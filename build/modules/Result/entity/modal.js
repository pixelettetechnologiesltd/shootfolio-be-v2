"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const resultSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    quiz: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Quiz',
    },
    status: {
        type: String,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
// add plugin that converts mongoose to json
resultSchema.plugin(paginate_1.default);
resultSchema.statics.build = (attrs) => {
    return new Result(attrs);
};
// const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
const Result = mongoose_1.default.model('Result', resultSchema);
exports.default = Result;
