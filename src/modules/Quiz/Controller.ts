import { Request, Response } from 'express';
// const catchAsync = require('../../utils/catchAsync');
import Service from './Service';
import { Pick } from '../../utils/pick';
import { QuizDoc } from './entity/interface';
import fs from 'fs';
class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    res.status(201).send(await Service.create(body));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Portfolio}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ['']);
    const options = Pick(req.query, ['page', 'limit']);
    const result = await Service.query(filter, options);
    return res.status(200).send(result);
  }

  public async answerSubmit(req: Request, res: Response) {
    const { body, user } = req;
    const result = await Service.answerSubmit(body, user);
    return res.status(200).send(result);
  }

  public async randomQuestion(req: Request, res: Response) {
    const doc = await Service.randomQuestion();
    return res.status(200).send(doc);
  }

  public async uploadQuestions(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file not provided.' });
    }

    const csvFilePath = req.file.path;

    try {
      const questions: QuizDoc[] = await Service.uploadQuestions(csvFilePath);

      for (const question of questions) {
        await question.save();
      }

      // Delete the temporary file after processing
      fs.unlink(csvFilePath, (err) => {
        if (err) {
          console.error('Error deleting temporary file:', err);
        }
      });

      res.status(200).json({ message: 'CSV file processed successfully.' });
    } catch (err) {
      console.error('Error processing CSV file:', err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameClub By ID}
   */
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.get(id);
    return res.status(200).send(response);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameClub By ID}
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const doc = await Service.update(id, body);
    return res.status(200).send(doc);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameClub By ID}
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.delete(id);
    return res.status(200).send(response);
  }
}

export default new Controller();
