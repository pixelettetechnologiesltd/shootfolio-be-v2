import {
  UserAttrs,
  UserDoc,
  UserUpdateAttrs,
  UserUpdateStatus,
  updateUserByAdmin,
} from './entity/user.interface';
import User from './entity/User.model';
import { BadRequestError } from '../../errors/badRequest.error';
import { Password } from '../../common/services/password';
import { TokenTypes } from '../Tokens/entity/token.interface';
import Token from '../Tokens/entity/Token.model';
import { Options, PaginationResult } from '../../common/interfaces';
import { ApiForbidden } from '../../errors/forbidden.error';
import config from '../../config/config';
import emailService from '../../common/services/email.service';
import { generateToken } from '../../utils/tokenService';
import { sendVerificationEmail } from '../../utils/emailService';

class UserService {
  constructor() {}

  /**
   *
   * @param userBody
   * @returns  {Promise<UserDoc>}
   */
  public async register(userBody: UserAttrs): Promise<UserDoc> {
    if (await User.isEmailTaken(userBody.email)) {
      throw new BadRequestError('Email already exists!');
    }
    const verificationToken = generateToken();
    userBody.verificationToken = verificationToken;
    const user = await User.build(userBody);
    await user.save();

    const verificationLink = `${config.nodeMailer.verificationLink}/${verificationToken}`;
    sendVerificationEmail(userBody.email, verificationLink);

    return user;
  }

  /**
   *
   * @param userBody
   * @returns  {Promise<UserDoc>}
   */
  public async socialLogin(userBody: UserAttrs): Promise<UserDoc> {
    const user = await User.findOne({ email: userBody.email });
    if (user) {
      return user;
    }
    userBody.isVerified = true;
    const newUser = await User.build(userBody);
    await newUser.save();
    return newUser;
  }

  /**
   *
   * @param email
   * @param password
   * @returns {Promise<UserDoc>}
   */
  public async login(email: string, password: string): Promise<UserDoc> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invlid Email or Password');
    }

    if (!(await Password.compare(user.password, password))) {
      throw new BadRequestError('Invalid Email or Password');
    }

    if (!user.isVerified) {
      throw new BadRequestError('Check your email to verify your account');
    }
    return user;
  }

  /**
   *
   * @param refreshToken
   */
  public async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: TokenTypes.refresh,
      blacklisted: false,
    });
    if (!refreshTokenDoc) {
      throw new BadRequestError('Invalid refresh token');
    }
    const updatedUser = await User.findById(refreshTokenDoc.user);

    if (!updatedUser) {
      throw new BadRequestError('No user found');
    }

    await updatedUser.save();
    await refreshTokenDoc.remove();
  }

  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  public async queryUsers(
    filter: object,
    options: Options
  ): Promise<PaginationResult> {
    const results = await User.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<UserDoc> }
   */
  public async getUserById(id: string): Promise<UserDoc> {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @param loggedUser
   * @returns { Promise<UserDoc>}
   */
  public async updateUser(
    id: string,
    updateBody: UserUpdateAttrs,
    loggedUser: UserDoc
  ): Promise<UserDoc> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError('No user exists with this ID!');
    }

    if (loggedUser.suspend || user.suspend) {
      throw new BadRequestError(
        'Your account has been suspended; please contact the administrator'
      );
    }
    if (loggedUser.role !== 'Admin' && user.id !== loggedUser.id)
      throw new ApiForbidden();
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }

  /**
   *
   * @param id
   * @param loggedUser
   * @returns {Promise<message: string>}
   */
  public async deleteUser(
    id: string,
    loggedUser: UserDoc
  ): Promise<{ message: string }> {
    const user = await this.getUserById(id);
    if (loggedUser.suspend || user.suspend) {
      throw new BadRequestError(
        'Your account has been suspended; please contact the administrator'
      );
    }
    if (loggedUser.role !== 'Admin') throw new ApiForbidden();
    await user.remove();
    return { message: 'User deleted successfully' };
  }

  /**
   *
   * @param token
   * @param userId
   * @returns {Promise<status: boolean>}
   */
  public async addDevceToken(
    token: string,
    userId: string
  ): Promise<{ success: boolean }> {
    const user = await User.findById(userId);

    if (!user) {
      throw new BadRequestError('No user exists with this ID!');
    }
    user.deviceToken?.push(token);
    await user.save();
    return { success: true };
  }

  /**
   *
   * @param email
   * @param oldPassword
   * @param newPassword
   * @returns {Promise<status: boolean>}
   */
  public async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Email not found');
    }
    if (!(await Password.compare(user.password, oldPassword))) {
      throw new BadRequestError('Old password does not match');
    }
    user.password = newPassword;
    await user.save();
    return { success: true };
  }

  /**
   *
   * @param id
   * @param body
   * @param loggedUser
   * @returns { Promise<UserDoc>}
   */
  public async updateStatus(
    id: string,
    body: UserUpdateStatus,
    loggedUser: UserDoc
  ): Promise<UserDoc> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError('No user exists with this ID!');
    }

    if (loggedUser.suspend || user.suspend) {
      throw new BadRequestError(
        'Your account has been suspended; please contact the administrator'
      );
    }
    if (loggedUser.role !== 'Admin' && user.id !== loggedUser.id)
      throw new ApiForbidden();
    Object.assign(user, body);
    await user.save();
    return user;
  }
  /**
   *
   * @param email
   * @returns {Promise<status: boolean>}
   */
  public async forgotPassword(email: string): Promise<{ success: boolean }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invlid Email or Password');
    }
    var otp = Math.floor(1000 + Math.random() * 9000);
    // @ts-ignore
    user.OTP['key'] = otp;
    await user.save();
    const msg = {
      to: user.email,
      from: config.email.from,
      subject: 'Forgot Password OTP',
      text: 'This email is for forgot password',
      html: `
        <p>Use the below OTP for forgot password</p>
        <p>OTP: ${otp}</otp>
        `,
    };
    emailService
      .sendEmail(msg)
      .then((response: any) => {
        console.log('Email sent successfully!', response);
      })
      .catch((error: any) => {
        console.error('Error sending email:', error);
      });
    return { success: true };
  }

  async resetPassword(
    otp: number,
    email: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invlid Email or Password');
    }
    // @ts-ignore
    if (user.OTP['key'] !== otp || user.OTP['key'] === null) {
      throw new BadRequestError('Bad OTP used for forgot password');
    }

    user.password = newPassword;
    user.OTP['key'] = null;
    await user.save();
    const msg = {
      to: user.email,
      from: config.email.from,
      subject: 'Passwor change confirmation',
      text: 'This email is for reset password',
      html: `
        <p>Your password has just been changed, you can login with your new password</p>
        `,
    };
    emailService.sendEmail(msg);
    return { success: true };
  }

  /**
   *
   * @param id
   * @param body
   * @returns {Promise<success: boolean>}
   */
  async updateUserByAdmin(
    id: string,
    body: updateUserByAdmin
  ): Promise<{ success: boolean }> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError('No user exists with this ID!');
    }
    Object.assign(user, body);
    await user.save();
    return { success: true };
  }

  async verifyEmail(token: string) {
    const user = await User.findOneAndUpdate(
      { verificationToken: token },
      { $set: { isVerified: true }, $unset: { verificationToken: 1 } },
      { new: true }
    );
    if (!user) {
      throw new BadRequestError('Invalid token');
    }
    return user;
  }

  async updateSubscription(id: string, subscriptionId: string) {
    const user = await User.findByIdAndUpdate(
      { _id: id }, // find a user by userId
      { $set: { subscription: subscriptionId, subscriptionDate: new Date() } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user; // return the updated user
  }

  async getUserStatistics() {
    const totalUserCount = await User.countDocuments({});
    const verifiedUserCount = await User.countDocuments({ isVerified: true });

    return {
      totalUser: totalUserCount,
      verifiedUser: verifiedUserCount,
    };
  }
}

export default new UserService();
