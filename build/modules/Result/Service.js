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
const modal_1 = __importDefault(require("./entity/modal"));
const badRequest_error_1 = require("../../errors/badRequest.error");
class Service {
    constructor() { }
    /**
     *
     * @param body
     * @returns {Promise<ResultDoc>}
     */
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield modal_1.default.build(body);
            yield doc.save();
            return doc;
        });
    }
    /**
     *
     * @param filter
     * @param options
     * @returns {Promise<PaginationResult>}
     */
    query(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield modal_1.default.paginate(filter, options);
            return results;
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<ResultDoc> }
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield modal_1.default.findById(id);
            if (!doc) {
                throw new badRequest_error_1.BadRequestError('Result not found');
            }
            return doc;
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<message: string>}
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.get(id);
            yield doc.remove();
            return { message: 'Result deleted successfully' };
        });
    }
}
exports.default = new Service();
