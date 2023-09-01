"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const fileUpload_1 = require("../../utils/fileUpload");
const router = express_1.default.Router();
exports.userRoute = router;
router
    .route('/')
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.queryUsers()), Controller_1.default.queryUsers);
router
    .route('/register')
    .post((0, validate_1.Validate)(Validation_1.default.register()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.register));
router
    .route('/login')
    .post((0, validate_1.Validate)(Validation_1.default.login()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.login));
router
    .route('/logout')
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.logout()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.logout));
router
    .route('/:id')
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.getUserById()), Controller_1.default.getUserById)
    .patch((0, auth_1.default)(), fileUpload_1.FileUpload.single('photoPath'), (0, validate_1.Validate)(Validation_1.default.updateUser()), Controller_1.default.updateUser)
    .delete((0, auth_1.default)('manageUsers'), (0, validate_1.Validate)(Validation_1.default.deleteUser()), Controller_1.default.deleteUser);
router
    .route('/device/token')
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.addDeviceToken()), Controller_1.default.addDeviceToken);
router
    .route('/change/password')
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.changePassword()), Controller_1.default.changePassword);
router
    .route('/status/:id')
    .patch((0, auth_1.default)('manageUsers'), (0, validate_1.Validate)(Validation_1.default.updateUser()), Controller_1.default.updateStatus);
router.post('/forgot/password', (0, validate_1.Validate)(Validation_1.default.forgotPassword()), Controller_1.default.forgotPassword);
router.post('/reset/password', (0, validate_1.Validate)(Validation_1.default.resetPassword), Controller_1.default.resetPassword);
router
    .route('/updateUser/:id')
    .patch((0, auth_1.default)('manageUsers'), (0, validate_1.Validate)(Validation_1.default.updateUserByAdmin), Controller_1.default.updateUserByAdmin);
router.route('/verify/:token').get(
// auth(),
(0, validate_1.Validate)(Validation_1.default.verifyToken), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.verifyEmail));
router
    .route('/social')
    .post((0, validate_1.Validate)(Validation_1.default.socialLogin()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.socialLogin));
router
    .route('/update/subscription/:id')
    .patch((0, auth_1.default)('manageUsers'), (0, validate_1.Validate)(Validation_1.default.updateSubscription()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.updateSubscription));
