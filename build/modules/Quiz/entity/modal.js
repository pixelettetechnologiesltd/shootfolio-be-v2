"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const quizSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (options) {
                return options.length === 4;
            },
            message: 'Options must contain exactly 4 values.',
        },
    },
    correctOption: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
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
quizSchema.plugin(paginate_1.default);
quizSchema.statics.build = (attrs) => {
    return new Quiz(attrs);
};
// const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
const Quiz = mongoose_1.default.model('Quiz', quizSchema);
exports.default = Quiz;
