"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const router = express_1.default.Router();
exports.adminRoute = router;
router
    .route("/")
    .get((0, auth_1.default)("manageAdmins"), (0, validate_1.Validate)(Validation_1.default.queryAdmin()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.queryAdmin))
    .post((0, auth_1.default)("manageAdmins"), (0, validate_1.Validate)(Validation_1.default.register()), Controller_1.default.register);
router
    .route("/login")
    .post((0, validate_1.Validate)(Validation_1.default.login()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.login));
router
    .route("/logout")
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.logout()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.logout));
router
    .route("/:id")
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.getAdminById()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.getAdminById))
    .patch((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.updateAdmin()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.updateAdmin))
    .delete((0, auth_1.default)("manageAdmins"), (0, validate_1.Validate)(Validation_1.default.deleteAdmin()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.deleteAdmin));
