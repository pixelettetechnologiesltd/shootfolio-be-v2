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
const badRequest_error_1 = require("../../errors/badRequest.error");
class Controller {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     * @Route {Create GameClub}
     */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            if (!req.file) {
                throw new badRequest_error_1.BadRequestError("Logo is required");
            }
            body.logo = req.file.filename;
            res.status(201).send(yield Service_1.default.create(body));
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query GameClubs}
     */
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, pick_1.Pick)(req.query, ["gameTypeId", "status"]);
            const options = (0, pick_1.Pick)(req.query, ["page", "limit"]);
            // options.populate = "gameTypeId";
            const reuslt = yield Service_1.default.query(filter, options);
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query GameClubs}
     */
    getCompeteCLubs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const filter = Pick(req.query, ["gameTypeId", "status"]);
            const options = (0, pick_1.Pick)(req.query, ["page", "limit"]);
            // options.populate = "gameTypeId";
            const reuslt = yield Service_1.default.getCompeteClubs(options);
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get GameClub By ID}
     */
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const doc = yield Service_1.default.get(id);
            return res.status(200).send(doc);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get GameClub By ID}
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            if (req.file) {
                body.logo = req.file.filename;
            }
            const doc = yield Service_1.default.update(id, body);
            return res.status(200).send(doc);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get GameClub By ID}
     */
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield Service_1.default.delete(id);
            return res.status(200).send(response);
        });
    }
}
exports.default = new Controller();
