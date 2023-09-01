"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const router = express_1.default.Router();
exports.gamesRoutes = router;
router
    .route("/")
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.create()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.create))
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.query()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.query));
router
    .route("/:id")
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.get()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.get))
    .patch((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.update()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.update))
    .delete((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.delete()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.delete));
router.get("/user/history", (0, auth_1.default)(), 
// Validate(Validation.query()),
(0, AsyncHandler_1.AsyncHandler)(Controller_1.default.getHistory));
router.post("/sell", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.sell()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.sell));
router.post("/buy", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.sell()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.buy));
router.post("/change/coin", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.changeCoin()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.changeCoin));
router.post("/borrow/money", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.borrowMoney()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.borrowMoney));
router.post("/pass/ball", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.passBall()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.passBall));
router.post("/tackle/opponent", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.tackle()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.tackle));
router.post("/shoot/opponent", (0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.tackle()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.shootBall));
