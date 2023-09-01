"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const router = express_1.default.Router();
exports.subscriptionRoutes = router;
router
    .route("/")
    .post((0, auth_1.default)("manageSubscription"), (0, validate_1.Validate)(Validation_1.default.create()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.create))
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.querySubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.querySubscription))
    .patch((0, auth_1.default)("manageSubscription"), (0, validate_1.Validate)(Validation_1.default.upgradeSubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.upgradeSubscription))
    .delete((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.upgradeSubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.cancelSubscription));
router.post("/subscribe", (0, auth_1.default)("subscribe"), (0, validate_1.Validate)(Validation_1.default.subscribe()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.subscribe));
router.post("/upgrade", (0, auth_1.default)("subscribe"), (0, validate_1.Validate)(Validation_1.default.upgradeSubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.upgradeSubscription));
router.post("/cancel", (0, auth_1.default)("subscribe"), 
// Validate(subscriptionValidation.upgradeSubscription()),
(0, AsyncHandler_1.AsyncHandler)(Controller_1.default.cancelSubscription));
router
    .route("/:id")
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.getSubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.getSubscription))
    .patch((0, auth_1.default)("manageSubscription"), (0, validate_1.Validate)(Validation_1.default.update()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.updateSubscription));
router.post("/webhook", (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.handleFailedPayments));
