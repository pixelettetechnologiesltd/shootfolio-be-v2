import { Request, Response } from "express";
import adminService from "./Service";
import tokenService from "../Tokens/Service";
import { Pick } from "../../utils/pick";

class AdminController {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Register Admin}
   */
  public async register(req: Request, res: Response) {
    const { body } = req;
    res.status(201).send(await adminService.register(body));
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Login Admin}
   */
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await adminService.login(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(200).send({ user, tokens });
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Logout Admin}
   */
  public async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await adminService.logout(refreshToken);
    res.status(200).send({ success: true });
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query User}
   */
  public async queryAdmin(req: Request, res: Response) {
    const filter = {};
    const options = Pick(req.query, [
      "page",
      "limit",
      "status",
      "role",
      "active",
    ]);
    const reuslt = await adminService.queryAdmin(filter, options);
    return res.status(200).send(reuslt);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Admin By ID}
   */
  public async getAdminById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await adminService.getAdminById(id);
    return res.status(200).send(user);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Admin By ID}
   */
  public async updateAdmin(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const currentUser = req.user;
    // @ts-ignore
    const user = await adminService.updateAdmin(id, body, currentUser);
    return res.status(200).send(user);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get Admin By ID}
   */
  public async deleteAdmin(req: Request, res: Response) {
    const { id } = req.params;
    const currentUser = req.user;
    // @ts-ignore
    const response = await adminService.deleteAdmin(id, currentUser);
    return res.status(200).send(response);
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Change Password}
   */
  public async changePassword(req: Request, res: Response) {
    const { email, newPassword, oldPassword } = req.body;
    const user = await adminService.changePassword(
      email,
      oldPassword,
      newPassword
    );
    res.status(200).send(user);
  }

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @Route {Forgot Password}
  //  */
  // public async forgotPassword(req: Request, res: Response) {
  //   const { email } = req.body;
  //   await adminService.forgotPassword(email);
  //   return res.status(201).send({ success: true });
  // }

  // /**
  //  *
  //  * @param req
  //  * @param res
  //  * @Route {Reset Password}
  //  */
  // public async resetPassword(req: Request, res: Response) {
  //   const { email, otp, newPassword } = req.body;
  //   const user = await adminService.resetPassword(otp, email, newPassword);
  //   return res.status(201).send(user);
  // }
}

export default new AdminController();
