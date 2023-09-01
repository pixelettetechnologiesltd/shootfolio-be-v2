import { Request, Response } from "express";
import subscriptionService from "./Service";
import { Pick } from "../../utils/pick";
import mongoose from "mongoose";
import { BadRequestError } from "../../errors/badRequest.error";

class SubscriptionController {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   */
  public async create(req: Request, res: Response) {
    const { body } = req;
    res.send(await subscriptionService.create(body));
  }

  /**
   *
   * @param req
   * @param res
   */
  public async subscribe(req: Request, res: Response) {
    const { subscriptionId, coupon } = req.body;
    const result = await subscriptionService.subscribe(
      //@ts-ignore
      req.user,
      subscriptionId
    );
    res.send(result);
  }

  /**
   *
   * @param req
   * @param res
   */
  public async upgradeSubscription(req: Request, res: Response) {
    console.log("HHHHHHHHHHHHH");

    const { subscriptionId } = req.body;
    const result = await subscriptionService.upgradeSubscription(
      //@ts-ignore
      req.user,
      subscriptionId
    );
    res.send(result);
  }

  public async cancelSubscription(req: Request, res: Response) {
    // const { subscriptionId } = req.body;
    const result = await subscriptionService.cancelSubscription(
      //@ts-ignore
      req.user
    );
    res.send(result);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query Copouns}
   */
  public async querySubscription(req: Request, res: Response) {
    const filter = Pick(req.query, []);
    const options = Pick(req.query, ["page", "limit"]);
    const reuslt = await subscriptionService.querySubscription(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Copoun By ID}
   */
  public async getSubscription(req: Request, res: Response) {
    const { id } = req.params;
    const service = await subscriptionService.getSubscription(id);
    return res.status(200).send(service);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Copoun By ID}
   */
  public async updateSubscription(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const user = await subscriptionService.updateSubscription(id, body);
    return res.status(200).send(user);
  }

  /**
   *
   *
   */

  public async handleFailedPayments(req: Request, res: Response) {
    return await subscriptionService.handleFailedPayments(req);
  }
}

export default new SubscriptionController();
