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
const User_model_1 = __importDefault(require("../User/entity/User.model"));
const Admin_model_1 = __importDefault(require("../Admin/entity/Admin.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class Controller {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     * @Route {Create Game}
     */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            // @ts-ignore
            res.status(201).send(yield Service_1.default.create(body, req.user));
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query Game}
     */
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, pick_1.Pick)(req.query, [
                "rival",
                "status",
                "rivalClub",
                "challengerClub",
                "gameMode",
                "challenger",
            ]);
            const options = (0, pick_1.Pick)(req.query, ["page", "limit"]);
            const reuslt = yield Service_1.default.query(filter, options);
            for (let i = 0; i < reuslt.results.length; i++) {
                // @ts-ignore
                if (reuslt.results[i].rival) {
                    let user;
                    // @ts-ignore
                    user = yield User_model_1.default.findById(reuslt.results[i].rival);
                    if (user) {
                        // @ts-ignore
                        reuslt.results[i].rival = user;
                    }
                    else {
                        // @ts-ignore
                        user = yield Admin_model_1.default.findById(reuslt.results[i].rival);
                        // @ts-ignore
                        reuslt.results[i].rival = user;
                    }
                }
            }
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query Game}
     */
    getHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const { id } = req.user;
            console.log(id);
            const filter = {
                $or: [
                    { rival: new mongoose_1.default.Types.ObjectId(id) },
                    { challenger: new mongoose_1.default.Types.ObjectId(id) },
                    { "rivalProtfolios.user": new mongoose_1.default.Types.ObjectId(id) },
                    { "challengerClub.user": new mongoose_1.default.Types.ObjectId(id) },
                    { "rival._id": new mongoose_1.default.Types.ObjectId(id) },
                ],
            };
            const options = (0, pick_1.Pick)(req.query, ["page", "limit"]);
            const reuslt = yield Service_1.default.query(filter, options);
            for (let i = 0; i < reuslt.results.length; i++) {
                // @ts-ignore
                if (reuslt.results[i].rival) {
                    let user;
                    // @ts-ignore
                    user = yield User_model_1.default.findById(reuslt.results[i].rival);
                    if (user) {
                        // @ts-ignore
                        reuslt.results[i].rival = user;
                    }
                    else {
                        // @ts-ignore
                        user = yield Admin_model_1.default.findById(reuslt.results[i].rival);
                        // @ts-ignore
                        reuslt.results[i].rival = user;
                    }
                }
            }
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Game By ID}
     */
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const doc = yield Service_1.default.get(id);
            let user;
            user = yield User_model_1.default.findById(doc.rival);
            if (user) {
                // @ts-ignore
                doc.rival = user;
            }
            else {
                user = yield Admin_model_1.default.findById(doc.rival);
                // @ts-ignore
                doc.rival = user;
            }
            return res.status(200).send(doc);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Game By ID}
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            if (req.file) {
                body.iconUrl = req.file.filename;
            }
            const doc = yield Service_1.default.update(id, body);
            return res.status(200).send(doc);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Delete Game By ID}
     */
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield Service_1.default.delete(id);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Delete Game By ID}
     */
    sell(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            // @ts-ignore
            const response = yield Service_1.default.sell(body.id, body, user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Delete Game By ID}
     */
    buy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            // @ts-ignore
            const response = yield Service_1.default.buy(body.id, body, user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Change coin}
     */
    changeCoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            // @ts-ignore
            const response = yield Service_1.default.changeCoin(body.id, body, user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Delete Game By ID}
     */
    passBall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            const response = yield Service_1.default.passBall(body.gameId, { portfolio: body.portfolio, player: body.player }, 
            // @ts-ignore
            user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Tackle}
     */
    tackle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            const response = yield Service_1.default.tackleBall(body.gameId, { player: body.player }, 
            // @ts-ignore
            user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Shoot}
     */
    shootBall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            const response = yield Service_1.default.shootBall(body.gameId, { player: body.player }, 
            // @ts-ignore
            user);
            return res.status(200).send(response);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Change coin}
     */
    borrowMoney(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            const { body } = req;
            const { user } = req;
            // @ts-ignore
            const response = yield Service_1.default.borrowMoney(body.id, body, user);
            return res.status(200).send(response);
        });
    }
}
exports.default = new Controller();
