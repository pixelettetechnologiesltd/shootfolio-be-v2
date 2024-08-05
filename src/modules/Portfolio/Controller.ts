import { Request, Response } from 'express';
import Service from './Service';
import { Pick } from '../../utils/pick';

class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Create Portfolio}
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    console.log('body====', body);

    res.status(201).send(await Service.create(body));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Portfolio}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ['admin', 'club']);
    const options = Pick(req.query, ['page', 'limit']);
    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Portfolio By ID}
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
    @Route {Get Portfolio By ID}
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

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Portfolio By ID}
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.delete(id);
    return res.status(200).send(response);
  }
}

export default new Controller();
