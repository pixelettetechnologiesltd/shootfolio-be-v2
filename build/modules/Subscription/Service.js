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
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const Subscription_Model_1 = __importDefault(require("./entity/Subscription.Model"));
const badRequest_error_1 = require("../../errors/badRequest.error");
const creditCard_Model_1 = __importDefault(require("../Card/entity/creditCard.Model"));
const User_model_1 = __importDefault(require("../User/entity/User.model"));
const logger_1 = require("../../config/logger");
const client = new stripe_1.default(config_1.default.stripe.key, {
    apiVersion: "2022-11-15",
});
class SubscriptionService {
    constructor() { }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield Subscription_Model_1.default.isSubscriptionNameTaken(body.name)) {
                throw new badRequest_error_1.BadRequestError("Subscription name already exists");
            }
            try {
                // create product on stripe
                const product = yield client.products.create({
                    name: body.name,
                    metadata: {
                        leauges: JSON.stringify(body.leagues.reduce((acc, next, index) => {
                            acc[index] = next.toString();
                            return acc;
                        }, {})),
                    },
                });
                // create price on stripe
                const price = yield client.prices.create({
                    currency: "usd",
                    unit_amount: body.amount,
                    recurring: { interval: "month" },
                    product: product.id,
                });
                const subscription = yield Subscription_Model_1.default.build(Object.assign({}, body));
                subscription.priceId = price.id;
                subscription.productId = product.id;
                yield subscription.save();
                return subscription;
            }
            catch (error) {
                logger_1.Logger.error(error);
                if (error instanceof Error) {
                    throw new badRequest_error_1.BadRequestError(error.message);
                }
                else {
                    throw new badRequest_error_1.BadRequestError("Something went wrong");
                }
            }
        });
    }
    subscribe(user, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.getSubscription(subscriptionId);
            if (!subscription) {
                throw new badRequest_error_1.BadRequestError("Subscription not found");
            }
            const customer = yield creditCard_Model_1.default.findOne({ user: user.id });
            if (!customer) {
                throw new badRequest_error_1.BadRequestError("You dont have any cards yet, add card first");
            }
            const stripeSUbscription = yield client.subscriptions.create({
                customer: customer.customer_id,
                items: [{ price: subscription.priceId }],
                default_payment_method: customer.payment_id,
            });
            customer.subscription_id = subscription.priceId;
            yield customer.save();
            yield User_model_1.default.updateOne({ _id: user.id }, { $set: { subscription: subscription._id, subId: stripeSUbscription.id } });
            // @ts-ignore
            return yield User_model_1.default.findById(user.id).populate("subscription");
        });
    }
    /**
     *
     * @param id
     * @param body
     * @returns {Promise<{success: boolean}>}
     */
    upgradeSubscription(user, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.subscription) {
                throw new badRequest_error_1.BadRequestError("You don't have any subscription yet!");
            }
            const subscription = yield this.getSubscription(subscriptionId);
            if (!subscription) {
                throw new badRequest_error_1.BadRequestError("No subscription found!");
            }
            const card = yield creditCard_Model_1.default.findOne({ user: user.id });
            if (!(card === null || card === void 0 ? void 0 : card.subscription_id)) {
                throw new badRequest_error_1.BadRequestError("You don't have any subscription yet!");
            }
            try {
                // @ts-ignore
                const oldSubscription = yield client.subscriptions.retrieve(user.subId);
                if (oldSubscription.id === card.subscription_id) {
                    throw new Error("You already subscribed to this subscription, please upgrade");
                }
                const customer = yield creditCard_Model_1.default.findOne({ user: user.id });
                if (!customer) {
                    throw new badRequest_error_1.BadRequestError("You dont have any cards yet, add card first");
                }
                // @ts-ignore
                yield client.subscriptions.del(user.subId);
                const stripeSUbscription = yield client.subscriptions.create({
                    customer: customer.customer_id,
                    items: [{ price: subscription.priceId }],
                    default_payment_method: customer.payment_id,
                });
                customer.subscription_id = subscription.priceId;
                yield customer.save();
                yield User_model_1.default.updateOne({ _id: user.id }, {
                    $set: {
                        subscription: subscription._id,
                        subId: stripeSUbscription.id,
                    },
                });
                yield user.save();
            }
            catch (error) {
                logger_1.Logger.error(error);
                if (error instanceof Error)
                    throw new badRequest_error_1.BadRequestError(error.message);
                throw new badRequest_error_1.BadRequestError("Something went wrong");
            }
            yield subscription.save();
            // @ts-ignore
            return yield User_model_1.default.findById(user.id).populate("subscription");
        });
    }
    /**
     *
     * @param id
     * @param body
     * @returns {Promise<{success: boolean}>}
     */
    cancelSubscription(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.subscription) {
                throw new badRequest_error_1.BadRequestError("You don't have any subscription yet!");
            }
            const card = yield creditCard_Model_1.default.findOne({ user: user.id });
            if (!(card === null || card === void 0 ? void 0 : card.subscription_id)) {
                throw new badRequest_error_1.BadRequestError("You don't have any subscription yet!");
            }
            try {
                // @ts-ignore
                yield client.subscriptions.del(user.subId);
                card.subscription_id = null;
                yield card.save();
                user.subscription = null;
                user.subId = null;
                user.save();
            }
            catch (error) {
                logger_1.Logger.error(error);
                if (error instanceof Error)
                    throw new badRequest_error_1.BadRequestError(error.message);
                throw new badRequest_error_1.BadRequestError("Something went wrong");
            }
            // @ts-ignore
            return yield user;
        });
    }
    /**
     *
     * @param filter
     * @param options
     * @returns {Promise<PaginationResult>}
     */
    querySubscription(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Subscription_Model_1.default.paginate(filter, options);
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<CopounDoc>}
     */
    getSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Subscription_Model_1.default.findById(id);
        });
    }
    /**
     *
     * @param id
     * @param body
     * @returns {Promise<CopounDoc>}
     */
    updateSubscription(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.getSubscription(id);
            if (!subscription) {
                throw new badRequest_error_1.BadRequestError("No subscription found!");
            }
            Object.assign(subscription, body);
            yield subscription.save();
            return subscription;
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<{success: boolean}>}
     */
    deleteSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.getSubscription(id);
            if (!subscription) {
                throw new badRequest_error_1.BadRequestError("No subscription found!");
            }
            yield subscription.remove();
            yield client.subscriptions.del(subscription.id);
            return { success: true };
        });
    }
    handleFailedPayments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const sig = req.headers["stripe-signature"];
            let event;
            try {
                if (sig) {
                    event = client.webhooks.constructEvent(req.body, sig, config_1.default.stripe.webHookKey);
                    switch (event.type) {
                        case "invoice.payment_failed":
                            const invoice = event.data.object;
                            const subscriptionId = invoice.subscription;
                            console.log(`Payment failed for subscription: ${subscriptionId}`);
                            const user = yield User_model_1.default.findOne({ subId: subscriptionId });
                            if (user) {
                                // @ts-ignore
                                user === null || user === void 0 ? void 0 : user.subscription = null;
                                // @ts-ignore
                                user === null || user === void 0 ? void 0 : user.subId = null;
                                yield (user === null || user === void 0 ? void 0 : user.save());
                                break;
                            }
                        default:
                            console.log(`Unhandled event type: ${event.type}`);
                    }
                }
            }
            catch (err) {
                console.error(err);
                throw new Error("Internal server error");
            }
        });
    }
}
exports.default = new SubscriptionService();
