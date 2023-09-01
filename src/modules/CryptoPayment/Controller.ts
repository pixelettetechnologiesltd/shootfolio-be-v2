import { Request, Response } from 'express';
import Service from './Service';
import { Pick } from '../../utils/pick';
import { BadRequestError } from '../../errors/badRequest.error';

class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Create GameType}
   */
  public async create(req: Request, res: Response) {
    const { body, user } = req;
    body.user = (user as any)._id;
    res.status(201).send(await Service.create(body));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query GameTypes}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ['status', 'user']);
    const options = Pick(req.query, ['page', 'limit', 'status']);
    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameType By ID}
   */
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await Service.get(id);
    return res.status(200).send(doc);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameType By ID}
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    if (req.file) {
      body.iconUrl = req.file.filename;
    }
    const doc = await Service.update(id, body);
    return res.status(200).send(doc);
  }
}

export default new Controller();
