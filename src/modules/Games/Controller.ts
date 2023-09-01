import { Request, Response } from "express";
import Service from "./Service";
import { Pick } from "../../utils/pick";
import User from "../User/entity/User.model";
import Admin from "../Admin/entity/Admin.model";
import { AdminDoc } from "../Admin/entity/admin.interface";
import mongoose from "mongoose";

class Controller {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Create Game}
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    // @ts-ignore
    res.status(201).send(await Service.create(body, req.user));
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Game}
   */
  public async query(req: Request, res: Response) {
    const filter = Pick(req.query, [
      "rival",
      "status",
      "rivalClub",
      "challengerClub",
      "gameMode",
      "challenger",
    ]);
    const options = Pick(req.query, ["page", "limit"]);
    const reuslt = await Service.query(filter, options);

    for (let i = 0; i < reuslt.results.length; i++) {
      // @ts-ignore
      if (reuslt.results[i].rival) {
        let user;
        // @ts-ignore
        user = await User.findById(reuslt.results[i].rival);

        if (user) {
          // @ts-ignore
          reuslt.results[i].rival = user;
        } else {
          // @ts-ignore
          user = await Admin.findById(reuslt.results[i].rival);
          // @ts-ignore
          reuslt.results[i].rival = user;
        }
      }
    }
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Game}
   */
  public async getHistory(req: Request, res: Response) {
    // @ts-ignore
    const { id } = req.user;
    console.log(id);

    const filter = {
      $or: [
        { rival: new mongoose.Types.ObjectId(id) },
        { challenger: new mongoose.Types.ObjectId(id) },
        { "rivalProtfolios.user": new mongoose.Types.ObjectId(id) },
        { "challengerClub.user": new mongoose.Types.ObjectId(id) },
        { "rival._id": new mongoose.Types.ObjectId(id) },
      ],
    };
    const options = Pick(req.query, ["page", "limit"]);
    const reuslt = await Service.query(filter, options);

    for (let i = 0; i < reuslt.results.length; i++) {
      // @ts-ignore
      if (reuslt.results[i].rival) {
        let user;
        // @ts-ignore
        user = await User.findById(reuslt.results[i].rival);

        if (user) {
          // @ts-ignore
          reuslt.results[i].rival = user;
        } else {
          // @ts-ignore
          user = await Admin.findById(reuslt.results[i].rival);
          // @ts-ignore
          reuslt.results[i].rival = user;
        }
      }
    }
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Game By ID}
   */
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await Service.get(id);
    let user;
    user = await User.findById(doc.rival);
    if (user) {
      // @ts-ignore
      doc.rival = user;
    } else {
      user = await Admin.findById(doc.rival);
      // @ts-ignore
      doc.rival = user;
    }
    return res.status(200).send(doc);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Game By ID}
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
    @Route {Delete Game By ID}
   */
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await Service.delete(id);
    return res.status(200).send(response);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Delete Game By ID}
   */
  public async sell(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    // @ts-ignore
    const response = await Service.sell(body.id, body, user);
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Delete Game By ID}
   */
  public async buy(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    // @ts-ignore
    const response = await Service.buy(body.id, body, user);
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Change coin}
   */
  public async changeCoin(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    // @ts-ignore
    const response = await Service.changeCoin(body.id, body, user);
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Delete Game By ID}
   */
  public async passBall(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    const response = await Service.passBall(
      body.gameId,
      { portfolio: body.portfolio, player: body.player },
      // @ts-ignore
      user
    );
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Tackle}
   */
  public async tackle(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    const response = await Service.tackleBall(
      body.gameId,
      { player: body.player },
      // @ts-ignore
      user
    );
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Shoot}
   */
  public async shootBall(req: Request, res: Response) {
    const { body } = req;
    const { user } = req;
    const response = await Service.shootBall(
      body.gameId,
      { player: body.player },
      // @ts-ignore
      user
    );
    return res.status(200).send(response);
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Change coin}
   */
  public async borrowMoney(req: Request, res: Response) {
    console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEE");

    const { body } = req;
    const { user } = req;
    // @ts-ignore
    const response = await Service.borrowMoney(body.id, body, user);
    return res.status(200).send(response);
  }
}

export default new Controller();
