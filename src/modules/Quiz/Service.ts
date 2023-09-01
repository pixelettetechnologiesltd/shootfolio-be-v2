import { QuizAttrs, QuizDoc, QuizModal } from "./entity/interface";
import Quiz from "./entity/modal";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";
import Result from "../Result/entity/modal";
import { ResultDoc } from "../Result/entity/interface";
import fs from "fs";
import csvParser from "csv-parser";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns {Promise<QuizDoc>}
   */
  public async create(body: QuizAttrs) {
    const doc = await Quiz.build(body);
    await doc.save();
    return doc;
  }

  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  public async query(
    filter: object,
    options: Options
  ): Promise<PaginationResult> {
    const results = await Quiz.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<QuizDoc> }
   */
  public async get(id: string): Promise<QuizDoc> {
    const doc = await Quiz.findById(id);
    if (!doc) {
      throw new BadRequestError("Quiz not found");
    }
    return doc;
  }

  /**
   *
   * @param body
   * @param loggedUser
   * @returns {Promise<ResultDoc>}
   */
  public async answerSubmit(
    body: { questionId: string; answer: number },
    loggedUser: any
  ) {
    const question = await Quiz.findOne({ _id: body.questionId });

    if (!question) {
      throw new BadRequestError("Quiz not found");
    }
    if (question.correctOption !== body.answer) {
      return { message: "Fail, please try again" };
    }
    const result = await Result.findOneAndUpdate(
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
  }

  public async randomQuestion() {
    const question = await Quiz.find();
    if (!question.length) {
      throw new BadRequestError("No quiz found");
    }
    const randomQuestion = Math.floor(Math.random() * question.length);
    return question[randomQuestion];
  }

  public async uploadQuestions(csvFilePath: string): Promise<QuizDoc[]> {
    const questions: QuizDoc[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", (row) => {
          const { question, options, correctOption } = row;
          const optionsArray = options.split(",");
          const newQuestion: QuizDoc = new Quiz({
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
  }
}

export default new Service();
