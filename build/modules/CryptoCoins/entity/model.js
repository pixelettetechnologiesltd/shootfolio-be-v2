"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = __importDefault(require("../../../common/plugins/paginate"));
const config_1 = __importDefault(require("../../../config/config"));
const Schema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    cmc_rank: {
        type: Number,
    },
    num_market_pairs: {
        type: Number,
    },
    circulating_supply: {
        type: Number,
    },
    total_supply: {
        type: Number,
    },
    max_supply: {
        type: Number,
    },
    infinite_supply: {
        type: Boolean,
    },
    last_updated: {
        type: String,
    },
    date_added: {
        type: String,
    },
    quote: {
        USD: {
            price: {
                type: Number,
            },
            volume_24h: {
                type: Number,
            },
            volume_change_24h: {
                type: Number,
            },
            percent_change_1h: {
                type: Number,
            },
            percent_change_24h: {
                type: Number,
            },
            percent_change_7d: {
                type: Number,
            },
            market_cap: {
                type: Number,
            },
            market_cap_dominance: {
                type: Number,
            },
            fully_diluted_market_cap: {
                type: Number,
            },
            last_updated: {
                type: String,
            },
        },
        BTC: {
            price: {
                type: Number,
            },
            volume_24h: {
                type: Number,
            },
            volume_change_24h: {
                type: Number,
            },
            percent_change_1h: {
                type: Number,
            },
            percent_change_24h: {
                type: Number,
            },
            percent_change_7d: {
                type: Number,
            },
            market_cap: {
                type: Number,
            },
            market_cap_dominance: {
                type: Number,
            },
            fully_diluted_market_cap: {
                type: Number,
            },
            last_updated: {
                type: String,
            },
        },
    },
    photoPath: {
        type: String,
        default: null,
    },
}, {
    toJSON: {
        transform(doc, ret) {
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
    return new CryptoCoins(attrs);
};
const CryptoCoins = mongoose_1.default.model("CryptoCoins", Schema);
exports.default = CryptoCoins;
