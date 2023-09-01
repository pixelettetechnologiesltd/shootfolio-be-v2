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
const creditCardSchema = new mongoose_1.default.Schema({
    customer_id: {
        type: String,
        required: true,
    },
    subscription_id: {
        type: String,
        default: null,
    },
    payment_id: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    },
    address: {
        city: {
            type: String,
        },
        line1: {
            type: String,
        },
        line2: {
            type: String,
        },
        postal_code: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    card: {
        name: {
            type: String,
            default: null,
        },
        number: {
            type: String,
            required: true,
        },
        exp_month: {
            type: Number,
            required: true,
        },
        exp_year: {
            type: Number,
            required: true,
        },
        cvc: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Credit', 'Debit'],
        },
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.card['exp_month'];
            delete ret.card['exp_year'];
            delete ret.card['cvc'];
            delete ret.customer_id;
            delete ret.subscription_id;
            delete ret.payment_id;
        },
    },
    timestamps: true,
});
creditCardSchema.plugin(paginate_1.default);
creditCardSchema.statics.build = (attrs) => {
    return new Card(attrs);
};
creditCardSchema.statics.isCardTaken = function (number) {
    return __awaiter(this, void 0, void 0, function* () {
        const card = yield this.findOne({ 'card.number': number });
        return !!card;
    });
};
const Card = mongoose_1.default.model('Card', creditCardSchema);
exports.default = Card;
