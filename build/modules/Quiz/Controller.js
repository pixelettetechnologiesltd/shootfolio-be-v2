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
// const catchAsync = require('../../utils/catchAsync');
const Service_1 = __importDefault(require("./Service"));
const pick_1 = require("../../utils/pick");
const fs_1 = __importDefault(require("fs"));
class Controller {
    constructor() { }
    /**
     *
     * @param req
     * @param res
     */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            res.status(201).send(yield Service_1.default.create(body));
        });
    }
    /**
     *
     * @param req
     * @param res
      @Route {Query Portfolio}
     */
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, pick_1.Pick)(req.query, ['']);
            const options = (0, pick_1.Pick)(req.query, ['page', 'limit']);
            const result = yield Service_1.default.query(filter, options);
            return res.status(200).send(result);
        });
    }
    answerSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user } = req;
            const result = yield Service_1.default.answerSubmit(body, user);
            return res.status(200).send(result);
        });
    }
    randomQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield Service_1.default.randomQuestion();
            return res.status(200).send(doc);
        });
    }
    uploadQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                return res.status(400).json({ error: 'CSV file not provided.' });
            }
            const csvFilePath = req.file.path;
            try {
                const questions = yield Service_1.default.uploadQuestions(csvFilePath);
                for (const question of questions) {
                    yield question.save();
                }
                // Delete the temporary file after processing
                fs_1.default.unlink(csvFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
                res.status(200).json({ message: 'CSV file processed successfully.' });
            }
            catch (err) {
                console.error('Error processing CSV file:', err);
                res.status(500).json({ error: 'Internal server error.' });
            }
        });
    }
}
exports.default = new Controller();
