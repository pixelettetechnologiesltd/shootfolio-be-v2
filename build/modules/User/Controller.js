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
const Service_2 = __importDefault(require("../Tokens/Service"));
const pick_1 = require("../../utils/pick");
class UserController {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     * @Route {Register User}
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const user = yield Service_1.default.register(body);
            const tokens = yield Service_2.default.generateAuthTokens(user);
            res.status(201).send({
                user,
                message: 'User registered. Please check your email for verification.',
                tokens,
            });
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Register User}
     */
    socialLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const user = yield Service_1.default.socialLogin(body);
            const tokens = yield Service_2.default.generateAuthTokens(user);
            res.status(201).send({
                user,
                message: 'User registered. Please check your email for verification.',
                tokens,
            });
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Login User}
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield Service_1.default.login(email, password);
            const tokens = yield Service_2.default.generateAuthTokens(user);
            res.status(200).send({ user, tokens });
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Logout User}
     */
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            yield Service_1.default.logout(refreshToken);
            res.status(200).send({ success: true });
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query User}
     */
    queryUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const options = (0, pick_1.Pick)(req.query, [
                'page',
                'limit',
                'status',
                'role',
                'suspended',
                'active',
            ]);
            const result = yield Service_1.default.queryUsers(filter, options);
            return res.status(200).send(result);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get User By ID}
     */
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield Service_1.default.getUserById(id);
            return res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get User By ID}
     */
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const currentUser = req.user;
            if (req.file) {
                body.photoPath = req.file.filename;
            }
            // @ts-ignore
            const user = yield Service_1.default.updateUser(id, body, currentUser);
            return res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get User By ID}
     */
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const currentUser = req.user;
            // @ts-ignore
            const user = yield Service_1.default.updateStatus(id, body, currentUser);
            return res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get User By ID}
     */
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const currentUser = req.user;
            // @ts-ignore
            const response = yield Service_1.default.deleteUser(id, currentUser);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Add Device Token}
     */
    addDeviceToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const { id } = req.user;
            const { token } = req.body;
            const response = yield Service_1.default.addDevceToken(token, id);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Change Password}
     */
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword, oldPassword } = req.body;
            const user = yield Service_1.default.changePassword(email, oldPassword, newPassword);
            res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Forgot Password}
     */
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            yield Service_1.default.forgotPassword(email);
            return res.status(201).send({ success: true });
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Reset Password}
     */
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp, newPassword } = req.body;
            const user = yield Service_1.default.resetPassword(otp, email, newPassword);
            return res.status(201).send(user);
        });
    }
    updateUserByAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const user = yield Service_1.default.updateUserByAdmin(id, body);
            return res.status(201).send(user);
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const user = yield Service_1.default.verifyEmail(token);
            res.status(200).json({ user, message: 'Email verified successfully' });
        });
    }
    updateSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { subscriptionId } = req.body;
            const user = yield Service_1.default.updateSubscription(id, subscriptionId);
            res.status(200).json({ user, message: 'subscription update successfully' });
        });
    }
}
exports.default = new UserController();
