"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Controller_1 = __importDefault(require("./Controller"));
const AsyncHandler_1 = require("../../utils/AsyncHandler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const Validation_1 = __importDefault(require("./Validation"));
const fileUpload_1 = require("../../utils/fileUpload");
const router = express_1.default.Router();
exports.quizRoutes = router;
router
    .route('/')
    .post((0, auth_1.default)('manageQuiz'), (0, validate_1.Validate)(Validation_1.default.create()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.create))
    .get((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.query()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.query));
router
    .route('/answerSubmit')
    .post((0, auth_1.default)(), (0, validate_1.Validate)(Validation_1.default.answerSubmit()), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.answerSubmit));
router.route('/random').get((0, auth_1.default)(), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.randomQuestion));
router
    .route('/uploadcsv')
    .post((0, auth_1.default)('manageQuiz'), fileUpload_1.FileUpload.single('csvFile'), (0, AsyncHandler_1.AsyncHandler)(Controller_1.default.uploadQuestions));
