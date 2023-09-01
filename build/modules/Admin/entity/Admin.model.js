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
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Admin",
    },
    rolePrivileges: {
        type: [String],
        default: [],
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.rolePrivileges;
        },
    },
    timestamps: true,
});
adminSchema.plugin(paginate_1.default);
adminSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const hashed = yield password_1.Password.toHash(this.get("password"));
            this.set("password", hashed);
        }
        this.rolePrivileges = [
            "manageGameTypes",
            "manageAdmins",
            "manageUsers",
            "manageGameLeauges",
            "manageGameModes",
            "manageGameClubs",
            "manageSubscription",
        ];
        done();
    });
});
adminSchema.statics.build = (attrs) => {
    return new Admin(attrs);
};
adminSchema.statics.isEmailTaken = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield this.findOne({ email });
        return !!admin;
    });
};
const Admin = mongoose_1.default.model("Admin", adminSchema);
exports.default = Admin;
