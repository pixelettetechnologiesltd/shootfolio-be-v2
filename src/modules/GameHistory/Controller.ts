import { Request, Response } from "express";
import Service from "./Service";
import { Pick } from "../../utils/pick";

class Controller {
  constructor() {}

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Game History}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, ["game", "user"]);
    const options = Pick(req.query, ["page", "limit", "status"]);

    const reuslt = await Service.query(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Game HistoryBy ID}
   */
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await Service.get(id);
    return res.status(200).send(doc);
  }
}

export default new Controller();
