import { Request, Response } from 'express';
import cardervice from './Service';
import tokenService from '../Tokens/Service';
import { Pick } from '../../utils/pick';

class CardController {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Register User}
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    // @ts-ignore
    res.status(201).send(await cardervice.create(body, req.user));
  }

  /**
   *
   * @param req
   * @param res
    @Route {Get User By ID}
   */
  public async getCardLoggedUser(req: Request, res: Response) {
    // @ts-ignore
    const user = await cardervice.getCardLoggedUser(req.user);
    return res.status(200).send(user);
  }

  // /**
  //  *
  //  * @param req
  //  * @param res
  //   @Route {Get User By ID}
  //  */
  // public async updateCard(req: Request, res: Response) {
  //   const { body } = req;
  //   const currentUser = req.user;
  //   if (req.file) {
  //     body.photoPath = req.file.filename;
  //   }
  //   // @ts-ignore
  //   const user = await userService.updateUser(body, currentUser);
  //   return res.status(200).send(user);
  // }

  /**
   *
   * @param req
   * @param res
    @Route {Get User By ID}
   */
  public async deleteCard(req: Request, res: Response) {
    const currentUser = req.user;
    // @ts-ignore
    const response = await cardervice.deleteCard(currentUser);
    return res.status(200).send(response);
  }
}

export default new CardController();
