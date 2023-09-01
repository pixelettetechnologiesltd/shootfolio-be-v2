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
const subscription_interface_1 = require("./subscription.interface");
const subscriptionSchema = new mongoose_1.default.Schema({
    priceId: {
        type: String,
        default: null,
    },
    productId: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
        enum: subscription_interface_1.SubscriptionTypes,
    },
    leagues: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: "GameLeague",
    },
    amount: {
        type: Number,
        required: true,
    },
}, {
    toJSON: {},
    timestamps: true,
});
subscriptionSchema.plugin(paginate_1.default);
subscriptionSchema.statics.build = (attrs) => {
    return new Subscription(attrs);
};
subscriptionSchema.statics.isSubscriptionNameTaken = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = yield this.findOne({ name });
        return !!doc;
    });
};
subscriptionSchema.pre(["find", "findOne"], function name(done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate("leagues");
        done();
    });
});
const Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
