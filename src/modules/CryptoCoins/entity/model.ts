import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import { CoinsAttrs, CoinsModel, CoinsDoc } from "./interface";

const Schema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        if (ret.iconUrl) {
          ret.iconUrl = config.rootPath + ret.iconUrl;
        }
      },
    },
    timestamps: true,
  }
);
Schema.plugin(paginate);

Schema.statics.build = (attrs: CoinsAttrs) => {
  return new CryptoCoins(attrs);
};

const CryptoCoins = mongoose.model<CoinsDoc, CoinsModel>("CryptoCoins", Schema);

export default CryptoCoins;
