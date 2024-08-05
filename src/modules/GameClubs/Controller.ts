import { Request, Response } from 'express';
import Service from './Service';
import { Pick } from '../../utils/pick';
import { BadRequestError } from '../../errors/badRequest.error';
import config from '../../config/config';

class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Create GameClub}
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    if (!req.file) {
      throw new BadRequestError('Logo is required');
    }
    body.logo = req.file.filename;
    res.status(201).send(await Service.create(body));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query GameClubs}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ['gameTypeId', 'status']);
    const options = Pick(req.query, ['page', 'limit']);
    // options.populate = "gameTypeId";
    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Query GameClubs}
   */
  public async getCompeteCLubs(req: Request, res: Response) {
    // const filter = Pick(req.query, ["gameTypeId", "status"]);
    const options = Pick(req.query, ['page', 'limit']);
    // options.populate = "gameTypeId";
    const reuslt = await Service.getCompeteClubs(options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameClub By ID}
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
    @Route {Get GameClub By ID}
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    if (req.file) {
      body.logo = `${config.digitalOcean.url}/${req.file.originalname}`;
    }
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
