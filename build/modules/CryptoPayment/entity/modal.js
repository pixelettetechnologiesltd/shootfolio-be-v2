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
const cryptoPaymentSchema = new mongoose_1.default.Schema({
    subscription: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    paymentMethod: {
        type: String,
        default: null,
        required: true,
    },
    transactionHash: {
        type: String,
        default: null,
        required: true,
    },
    status: {
        type: String,
        enum: interface_1.CryptoPaymentStatus,
        default: interface_1.CryptoPaymentStatus.Pending,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
}, {
    toJSON: {},
    timestamps: true,
});
cryptoPaymentSchema.plugin(paginate_1.default);
cryptoPaymentSchema.pre(['find', 'findOne'], function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate('subscription').populate('user');
        done();
    });
});
cryptoPaymentSchema.statics.build = (attrs) => {
    return new CryptoPayment(attrs);
};
const CryptoPayment = mongoose_1.default.model('CryptoPayment', cryptoPaymentSchema);
exports.default = CryptoPayment;
