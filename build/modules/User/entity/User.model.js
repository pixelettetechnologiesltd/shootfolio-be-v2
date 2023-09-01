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
const password_1 = require("../../../common/services/password");
const config_1 = __importDefault(require("../../../config/config"));
const badRequest_error_1 = require("../../../errors/badRequest.error");
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        // required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photoPath: {
        type: String,
        default: null,
    },
    walletAddress: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
    },
    rolePrivileges: {
        type: [String],
        default: [],
    },
    deviceToken: [String],
    OTP: {
        key: {
            type: Number,
            default: null,
        },
    },
    status: {
        type: String,
        default: null,
    },
    subscription: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Subscription',
    },
    subId: {
        type: String,
    },
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    subscriptionDate: {
        type: Date,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            // delete ret.createdAt;
            // delete ret.updatedAt;
            delete ret.rolePrivileges;
            delete ret.OTP;
            delete ret.verificationToken;
            if (ret.photoPath) {
                ret.photoPath = config_1.default.rootPath + ret.photoPath;
            }
            if (ret.suspend) {
                throw new badRequest_error_1.BadRequestError('Your account has been suspended, Please contact adminstrator!');
            }
        },
    },
    timestamps: true,
});
userSchema.plugin(paginate_1.default);
userSchema.pre('save', function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hashed = yield password_1.Password.toHash(this.get('password'));
            this.set('password', hashed);
        }
        this.rolePrivileges = ['subscribe'];
        done();
    });
});
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
userSchema.statics.isUserNameTaken = function (userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ userName });
        return !!user;
    });
};
userSchema.pre(['find', 'findOne'], function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate('subscription');
        done();
    });
});
userSchema.statics.isEmailTaken = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        return !!user;
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
