import { Request, Response } from 'express';
const catchAsync = require('../../utils/catchAsync');
import Service from './Service';
import { Pick } from '../../utils/pick';

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
    @Route {Query Result}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ['admin']);
    const options = Pick(req.query, ['page', 'limit']);
    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Result By ID}
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
    @Route {Get Result By ID}
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.delete(id);
    return res.status(200).send(response);
  }
}

export default new Controller();
