import { Request, Response } from "express";
import Service from "./Service";
import { Pick } from "../../utils/pick";
import { BadRequestError } from "../../errors/badRequest.error";

class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Create GameMode}
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    res.status(201).send(await Service.create(body));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query GameMode}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ["gameType"]);
    const options = Pick(req.query, ["page", "limit", "status"]);

    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get GameMode By ID}
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
    @Route {Get GameMode By ID}
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
    @Route {Get GameMode By ID}
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.delete(id);
    return res.status(200).send(response);
  }
}

export default new Controller();
