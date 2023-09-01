import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import {
  SubscriptionAttrs,
  SubscriptionDoc,
  SubscriptionModel,
  SubscriptionTypes,
} from "./subscription.interface";

const subscriptionSchema = new mongoose.Schema(
  {
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
      enum: SubscriptionTypes,
    },
    leagues: {
      type: [mongoose.Types.ObjectId],
      ref: "GameLeague",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {},
    timestamps: true,
  }
);

subscriptionSchema.plugin(paginate);

subscriptionSchema.statics.build = (attrs: SubscriptionAttrs) => {
  return new Subscription(attrs);
};

subscriptionSchema.statics.isSubscriptionNameTaken = async function (name) {
  const doc = await this.findOne({ name });
  return !!doc;
};

subscriptionSchema.pre(["find", "findOne"], async function name(done) {
  this.populate("leagues");
  done();
});
const Subscription = mongoose.model<SubscriptionDoc, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;
