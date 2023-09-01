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
class AdminController {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     * @Route {Register Admin}
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            res.status(201).send(yield Service_1.default.register(body));
        });
    }
    /**
     *
     * @param req
     * @param res
     * @Route {Login Admin}
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
      @Route {Logout Admin}
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
    queryAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const options = (0, pick_1.Pick)(req.query, [
                "page",
                "limit",
                "status",
                "role",
                "active",
            ]);
            const reuslt = yield Service_1.default.queryAdmin(filter, options);
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Admin By ID}
     */
    getAdminById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield Service_1.default.getAdminById(id);
            return res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Admin By ID}
     */
    updateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const currentUser = req.user;
            // @ts-ignore
            const user = yield Service_1.default.updateAdmin(id, body, currentUser);
            return res.status(200).send(user);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Admin By ID}
     */
    deleteAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const currentUser = req.user;
            // @ts-ignore
            const response = yield Service_1.default.deleteAdmin(id, currentUser);
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
}
exports.default = new AdminController();
