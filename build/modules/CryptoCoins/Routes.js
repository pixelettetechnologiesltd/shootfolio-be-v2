"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinsRoute = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const router = express_1.default.Router();
exports.coinsRoute = router;
router
    .route("/")
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.query()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.query));
router
    .route("/:id")
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.get()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.get))
    // .patch(
    //   auth("manageGameTypes"),
    //   FileUpload.single("photoPath"),
    //   Validate(Validation.update()),
    //   AsyncHandler(Controller.update)
    // )
    .delete((0, auth_1.default)("manageCoins"), (0, validate_1.Validate)(Validation_1.default.delete()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.delete));
