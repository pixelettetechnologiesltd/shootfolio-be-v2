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
const badRequest_error_1 = require("../../errors/badRequest.error");
const config_1 = __importDefault(require("../../config/config"));
const stripe_1 = __importDefault(require("stripe"));
const creditCard_Model_1 = __importDefault(require("./entity/creditCard.Model"));
const logger_1 = require("../../config/logger");
const client = new stripe_1.default(config_1.default.stripe.key, {
    apiVersion: '2022-11-15',
});
class CardService {
    constructor() { }
    /**
     *
     * @param userBody
     * @returns  {Promise<UserDoc>}
     */
    create(cardBody, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield client.customers.search({
                query: `email:'${user.email}'`,
            });
            if (!customer.data.length) {
                try {
                    const paymentMethod = yield client.paymentMethods.create({
                        type: 'card',
                        card: {
                            number: cardBody.number,
                            exp_month: cardBody.exp_month,
                            exp_year: cardBody.exp_year,
                            cvc: cardBody.cvc,
                        },
                    });
                    const newCustomer = yield client.customers.create({
                        payment_method: paymentMethod.id,
                        name: user.name,
                        email: user.email,
                    });
                    const payment = yield client.paymentMethods.attach(paymentMethod.id, {
                        customer: newCustomer.id,
                    });
                    const card = yield creditCard_Model_1.default.updateOne({ user: user.id }, {
                        customer_id: newCustomer.id,
                        payment_id: paymentMethod.id,
                        user: user.id,
                        address: {
                            city: cardBody.city,
                            line1: cardBody.line1,
                            line2: cardBody.line2,
                            postal_code: cardBody.postal_code,
                            state: cardBody.state,
                            country: cardBody.state,
                        },
                        card: {
                            number: cardBody.number,
                            exp_month: cardBody.exp_month,
                            exp_year: cardBody.exp_year,
                            cvc: cardBody.cvc,
                        },
                    }, { upsert: true });
                    return { success: true, message: 'Card addedd successfully' };
                }
                catch (error) {
                    logger_1.Logger.error(error);
                    if (error instanceof Error) {
                        throw new badRequest_error_1.BadRequestError(error.message);
                    }
                    throw new badRequest_error_1.BadRequestError('Somthing went wrong');
                }
            }
            return { success: false, message: 'You aleady added a card' };
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<CardDoc> }
     */
    getCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield creditCard_Model_1.default.findById(id);
            if (!card) {
                throw new badRequest_error_1.BadRequestError('User not found');
            }
            return card;
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<CardDoc> }
     */
    getCardLoggedUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield creditCard_Model_1.default.findOne({ user: user.id });
            if (!card) {
                return {};
            }
            return card;
        });
    }
    /**
     *
     * @param id
     * @param loggedUser
     * @returns {Promise<message: string>}
     */
    deleteCard(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield this.getCardLoggedUser(loggedUser);
            if (!Object.keys(card).length) {
                throw new badRequest_error_1.BadRequestError('Card not found');
            }
            try {
                if (Object.keys(card).length) {
                    // @ts-ignore
                    yield client.customers.del(card.customer_id);
                    loggedUser.subscription = null;
                    yield loggedUser.save();
                    // @ts-ignore
                    yield card.remove();
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new badRequest_error_1.BadRequestError(error.message);
                }
                console.log(error);
            }
            return { message: 'Card remove successfully' };
        });
    }
}
exports.default = new CardService();
