import {
  AdminAttrs,
  AdminModel,
  AdminDoc,
  AdminUpdateAttrs,
} from "./entity/admin.interface";
import Admin from "./entity/Admin.model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Password } from "../../common/services/password";
import { TokenTypes } from "../Tokens/entity/token.interface";
import Token from "../Tokens/entity/Token.model";
import { Options, PaginationResult } from "../../common/interfaces";
import { ApiForbidden } from "../../errors/forbidden.error";

class AdminService {
  constructor() {}

  /**
   *
   * @param userBody
   * @returns  {Promise<AdminDoc>}
   */
  public async register(userBody: AdminAttrs): Promise<AdminDoc> {
    if (await Admin.isEmailTaken(userBody.email)) {
      throw new BadRequestError("Email already exists!");
    }
    const user = await Admin.build(userBody);
    await user.save();
    return user;
  }

  /**
   *
   * @param email
   * @param password
   * @returns {Promise<AdminDoc>}
   */
  public async login(email: string, password: string): Promise<AdminDoc> {
    const user = await Admin.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invlid Email or Password");
    }

    if (!(await Password.compare(user.password, password))) {
      throw new BadRequestError("Invalid Email or Password");
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
      throw new BadRequestError("Invalid refresh token");
    }
    const updatedUser = await Admin.findById(refreshTokenDoc.user);

    if (!updatedUser) {
      throw new BadRequestError("No user found");
    }

    // updatedUser.active = false;
    await updatedUser.save();
    await refreshTokenDoc.remove();
  }

  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  public async queryAdmin(
    filter: object,
    options: Options
  ): Promise<PaginationResult> {
    const results = await Admin.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<AdminDoc> }
   */
  public async getAdminById(id: string): Promise<AdminDoc> {
    const user = await Admin.findById(id);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @param loggedUser
   * @returns { Promise<AdminDoc>}
   */
  public async updateAdmin(
    id: string,
    updateBody: AdminUpdateAttrs,
    loggedUser: AdminDoc
  ): Promise<AdminDoc> {
    const user = await this.getAdminById(id);
    if (!user) {
      throw new BadRequestError("No user exists with this ID!");
    }
    if (loggedUser.role !== "Admin" && user.id !== loggedUser.id)
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
  public async deleteAdmin(
    id: string,
    loggedUser: AdminDoc
  ): Promise<{ message: string }> {
    const user = await this.getAdminById(id);
    if (loggedUser.role !== "Admin") throw new ApiForbidden();
    await user.remove();
    return { message: "User deleted successfully" };
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
    const user = await Admin.findOne({ email });
    if (!user) {
      throw new BadRequestError("Email not found");
    }
    if (!(await Password.compare(user.password, oldPassword))) {
      throw new BadRequestError("Old password does not match");
    }
    user.password = newPassword;
    await user.save();
    return { success: true };
  }

  // /**
  //  *
  //  * @param email
  //  * @returns {Promise<status: boolean>}
  //  */
  // public async forgotPassword(email: string): Promise<{ success: boolean }> {
  //   const user = await User.findOne({ email });

  //   if (!user) {
  //     throw new BadRequestError("Invlid Email or Password");
  //   }
  //   var otp = Math.floor(1000 + Math.random() * 9000);
  //   // @ts-ignore
  //   user.OTP["key"] = otp;
  //   await user.save();
  //   const msg = {
  //     to: user.email, // Change to your recipient
  //     from: config.email.from, // Change to your verified sender
  //     subject: "Forgot Password OTP",
  //     text: "This email is for forgot password",
  //     html: `
  //       <p>Use the below OTP for forgot password</p>
  //       <p>OTP: ${otp}</otp>
  //       `,
  //   };
  //   emailService.sendEmail(msg);
  //   return { success: true };
  // }

  // async resetPassword(
  //   otp: number,
  //   email: string,
  //   newPassword: string
  // ): Promise<{ success: boolean }> {
  //   const user = await User.findOne({ email });

  //   if (!user) {
  //     throw new BadRequestError("Invlid Email or Password");
  //   }
  //   // @ts-ignore
  //   if (user.OTP["key"] !== otp || user.OTP["key"] === null) {
  //     throw new BadRequestError("Bad OTP used for forgot password");
  //   }

  //   user.password = newPassword;
  //   user.OTP["key"] = null;
  //   await user.save();
  //   const msg = {
  //     to: user.email, // Change to your recipient
  //     from: config.email.from, // Change to your verified sender
  //     subject: "Passwor change confirmation",
  //     text: "This email is for reset password",
  //     html: `
  //       <p>Your password has just been changed, you can login with your new password</p>
  //       `,
  //   };
  //   emailService.sendEmail(msg);
  //   return { success: true };
  // }
}

export default new AdminService();
