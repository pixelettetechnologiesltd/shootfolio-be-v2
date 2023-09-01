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
class CardController {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     * @Route {Register User}
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
      @Route {Get User By ID}
     */
    getCardLoggedUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const user = yield Service_1.default.getCardLoggedUser(req.user);
            return res.status(200).send(user);
        });
    }
    // /**
    //  *
    //  * @param req
    //  * @param res
    //   @Route {Get User By ID}
    //  */
    // public async updateCard(req: Request, res: Response) {
    //   const { body } = req;
    //   const currentUser = req.user;
    //   if (req.file) {
    //     body.photoPath = req.file.filename;
    //   }
    //   // @ts-ignore
    //   const user = await userService.updateUser(body, currentUser);
    //   return res.status(200).send(user);
    // }
    /**
     *
     * @param req
     * @param res
      @Route {Get User By ID}
     */
    deleteCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            // @ts-ignore
            const response = yield Service_1.default.deleteCard(currentUser);
            return res.status(200).send(response);
        });
    }
}
exports.default = new CardController();
