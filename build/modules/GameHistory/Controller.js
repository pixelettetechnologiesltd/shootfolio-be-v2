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
class Controller {
    constructor() { }
    /**
     *
     * @param req
     * @param res
      @Route {Query Game History}
     */
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, pick_1.Pick)(req.query, ["game", "user"]);
            const options = (0, pick_1.Pick)(req.query, ["page", "limit", "status"]);
            const reuslt = yield Service_1.default.query(filter, options);
            return res.status(200).send(reuslt);
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Get Game HistoryBy ID}
     */
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const doc = yield Service_1.default.get(id);
            return res.status(200).send(doc);
        });
    }
}
exports.default = new Controller();
