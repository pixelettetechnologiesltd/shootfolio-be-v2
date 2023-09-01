"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoute = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const router = express_1.default.Router();
exports.cardRoute = router;
router
    .route("/")
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.create()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.create));
router
    .route("/logged/user")
    .get((0, auth_1.default)(), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.getCardLoggedUser))
    .delete((0, auth_1.default)(), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.deleteCard));
