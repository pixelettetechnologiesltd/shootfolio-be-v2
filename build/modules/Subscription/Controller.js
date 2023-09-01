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
const Service_1 = __importDefault(require("./Service"));
const pick_1 = require("../../utils/pick");
class SubscriptionController {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            res.send(yield Service_1.default.create(body));
        });
    }
    /**
     *
     * @param req
     * @param res
     */
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subscriptionId, coupon } = req.body;
            const result = yield Service_1.default.subscribe(
            //@ts-ignore
            req.user, subscriptionId);
            res.send(result);
        });
    }
    /**
     *
     * @param req
     * @param res
     */
    upgradeSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("HHHHHHHHHHHHH");
            const { subscriptionId } = req.body;
            const result = yield Service_1.default.upgradeSubscription(
            //@ts-ignore
            req.user, subscriptionId);
            res.send(result);
        });
    }
    cancelSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { subscriptionId } = req.body;
            const result = yield Service_1.default.cancelSubscription(
            //@ts-ignore
            req.user);
            res.send(result);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query Copouns}
     */
    querySubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, pick_1.Pick)(req.query, []);
            const options = (0, pick_1.Pick)(req.query, ["page", "limit"]);
            const reuslt = yield Service_1.default.querySubscription(filter, options);
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Copoun By ID}
     */
    getSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const service = yield Service_1.default.getSubscription(id);
            return res.status(200).send(service);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Copoun By ID}
     */
    updateSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const user = yield Service_1.default.updateSubscription(id, body);
            return res.status(200).send(user);
        });
    }
    /**
     *
     *
     */
    handleFailedPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Service_1.default.handleFailedPayments(req);
        });
    }
}
exports.default = new SubscriptionController();
