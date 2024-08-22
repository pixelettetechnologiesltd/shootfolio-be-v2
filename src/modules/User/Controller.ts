import { Request, Response } from 'express';
import userService from './Service';
import tokenService from '../Tokens/Service';
import { Pick } from '../../utils/pick';

class UserController {
  constructor() {}

  /**
   *
   * @param req
   * @param res
   * @Route {Register User}
   */
  public async register(req: Request, res: Response) {
    const { body } = req;
    const user = await userService.register(body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(201).send({
      user,
      message: 'User registered. Please check your email for verification.',
      tokens,
    });
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Register User}
   */
  public async socialLogin(req: Request, res: Response) {
    const { body } = req;
    const user = await userService.socialLogin(body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(201).send({
      user,
      message: 'User registered. Please check your email for verification.',
      tokens,
    });
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Login User}
   */
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(200).send({ user, tokens });
  }
  /**
   * 
   * @param req 
   * @param res 
    @Route {Logout User}
   */
  public async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await userService.logout(refreshToken);
    res.status(200).send({ success: true });
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Query User}
   */
  public async queryUsers(req: Request, res: Response) {
    const filter = {};
    const options = Pick(req.query, [
      'page',
      'limit',
      'status',
      'role',
      'suspended',
      'active',
    ]);
    const result = await userService.queryUsers(filter, options);
    return res.status(200).send(result);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get User By ID}
   */
  public async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(200).send(user);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get User By ID}
   */
  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const currentUser = req.user;
    if (req.file) {
      body.photoPath = req.file.filename;
    }
    // @ts-ignore
    const user = await userService.updateUser(id, body, currentUser);
    return res.status(200).send(user);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get User By ID}
   */
  public async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const currentUser = req.user;
    // @ts-ignore
    const user = await userService.updateStatus(id, body, currentUser);
    return res.status(200).send(user);
  }

  /**
   * 
   * @param req 
   * @param res 
    @Route {Get User By ID}
   */
  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const currentUser = req.user;
    // @ts-ignore
    const response = await userService.deleteUser(id, currentUser);
    return res.status(200).send(response);
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Add Device Token}
   */
  public async addDeviceToken(req: Request, res: Response) {
    // @ts-ignore
    const { id } = req.user;
    const { token } = req.body;
    const response = await userService.addDevceToken(token, id);
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
    const user = await userService.changePassword(
      email,
      oldPassword,
      newPassword
    );
    res.status(200).send(user);
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Forgot Password}
   */
  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await userService.forgotPassword(email);
    return res.status(201).send({ success: true });
  }

  /**
   *
   * @param req
   * @param res
   * @Route {Reset Password}
   */
  public async resetPassword(req: Request, res: Response) {
    const { email, otp, newPassword } = req.body;
    const user = await userService.resetPassword(otp, email, newPassword);
    return res.status(201).send(user);
  }

  public async updateUserByAdmin(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const user = await userService.updateUserByAdmin(id, body);
    return res.status(201).send(user);
  }

  public async verifyEmail(req: Request, res: Response) {
    try {
        const { token } = req.params;
        const user = await userService.verifyEmail(token);
        res.redirect('http://localhost:3000/#/verification');
        
    } catch (error) {
        res.status(400).json({ message: 'Email verification failed', error: error });
    }
  }

  public async updateSubscription(req: Request, res: Response) {
    const { id } = req.params;
    const { subscriptionId } = req.body;
    const user = await userService.updateSubscription(id, subscriptionId);
    res.status(200).json({ user, message: 'subscription update successfully' });
  }

  public async getUserStatistics(req: Request, res: Response) {
    const result = await userService.getUserStatistics();
    res.status(200).send(result);
  }
}

export default new UserController();
