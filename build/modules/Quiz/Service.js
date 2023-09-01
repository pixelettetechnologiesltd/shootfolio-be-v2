"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const modal_1 = __importDefault(require("./entity/modal"));
const badRequest_error_1 = require("../../errors/badRequest.error");
const modal_2 = __importDefault(require("../Result/entity/modal"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
class Service {
  constructor() {}
  /**
   *
   * @param body
   * @returns {Promise<QuizDoc>}
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
   * @returns {Promise<QuizDoc> }
   */
  get(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield modal_1.default.findById(id);
      if (!doc) {
        throw new badRequest_error_1.BadRequestError("Quiz not found");
      }
      return doc;
    });
  }
  /**
   *
   * @param body
   * @param loggedUser
   * @returns {Promise<ResultDoc>}
   */
  answerSubmit(body, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const question = yield modal_1.default.findOne({ _id: body.questionId });
      if (!question) {
        throw new badRequest_error_1.BadRequestError("Quiz not found");
      }
      if (question.correctOption !== body.answer) {
        return { message: "Fail, please try again" };
      }
      const result = yield modal_2.default.findOneAndUpdate(
        {
          user: loggedUser.id,
          quiz: question.id,
          status: "pass",
        },
        {
          $set: {
            user: loggedUser.id,
            quiz: question.id,
            status: "pass",
          },
        },
        { new: true, upsert: true }
      );
      return result;
    });
  }
  randomQuestion() {
    return __awaiter(this, void 0, void 0, function* () {
      const question = yield modal_1.default.find();
      if (!question.length) {
        throw new badRequest_error_1.BadRequestError("No quiz found");
      }
      const randomQuestion = Math.floor(Math.random() * question.length);
      return question[randomQuestion];
    });
  }
  uploadQuestions(csvFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
      const questions = [];
      return new Promise((resolve, reject) => {
        fs_1.default
          .createReadStream(csvFilePath)
          .pipe((0, csv_parser_1.default)())
          .on("data", (row) => {
            const { question, options, correctOption } = row;
            const optionsArray = options.split(",");
            const newQuestion = new modal_1.default({
              question,
              options: optionsArray,
              correctOption: parseInt(correctOption, 10),
            });
            questions.push(newQuestion);
          })
          .on("end", () => {
            resolve(questions);
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    });
  }
}
exports.default = new Service();
