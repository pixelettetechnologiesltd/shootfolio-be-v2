import { Request, Response } from 'express';
import Service from './Service';
import { Pick } from '../../utils/pick';

class Controller {
  constructor() {}

  //   /**
  //    *
  //    * @param req
  //    * @param res
  //    * @Route {Create Game}
  //    */
  //   public async create(req: Request, res: Response) {
  //     // @ts-ignore
  //     res.status(201).send(await Service.updateLeaderboard());
  //   }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Game}
   */
  public async updateLeaderboard(req: Request, res: Response) {
    const reuslt = await Service.updateLeaderboard();
    console.log('result', reuslt);

    return res.status(200).send(reuslt);
  }
}

export default new Controller();
