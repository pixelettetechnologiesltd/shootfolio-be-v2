"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("./entity/User.model"));
const badRequest_error_1 = require("../../errors/badRequest.error");
const password_1 = require("../../common/services/password");
const token_interface_1 = require("../Tokens/entity/token.interface");
const Token_model_1 = __importDefault(require("../Tokens/entity/Token.model"));
const forbidden_error_1 = require("../../errors/forbidden.error");
const config_1 = __importDefault(require("../../config/config"));
const email_service_1 = __importDefault(
  require("../../common/services/email.service")
);
const tokenService_1 = require("../../utils/tokenService");
const emailService_1 = require("../../utils/emailService");
class UserService {
  constructor() {}
  /**
   *
   * @param userBody
   * @returns  {Promise<UserDoc>}
   */
  register(userBody) {
    return __awaiter(this, void 0, void 0, function* () {
      if (yield User_model_1.default.isEmailTaken(userBody.email)) {
        throw new badRequest_error_1.BadRequestError("Email already exists!");
      }
      const verificationToken = (0, tokenService_1.generateToken)();
      // const user = new User({ email, password, verificationToken });
      userBody.verificationToken = verificationToken;
      const user = yield User_model_1.default.build(userBody);
      yield user.save();
      const verificationLink = `${config_1.default.nodeMailer.verificationLink}/${verificationToken}`;
      (0,
      emailService_1.sendVerificationEmail)(userBody.email, verificationLink);
      // await user.save();
      return user;
    });
  }
  /**
   *
   * @param userBody
   * @returns  {Promise<UserDoc>}
   */
  socialLogin(userBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOne({
        email: userBody.email,
      });
      if (user) {
        return user;
      }
      userBody.isVerified = true;
      const newUser = yield User_model_1.default.build(userBody);
      yield newUser.save();
      return newUser;
    });
  }
  /**
   *
   * @param email
   * @param password
   * @returns {Promise<UserDoc>}
   */
  login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOne({ email });
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "Invlid Email or Password"
        );
      }
      if (!(yield password_1.Password.compare(user.password, password))) {
        throw new badRequest_error_1.BadRequestError(
          "Invalid Email or Password"
        );
      }
      // if (user.suspend) {
      //   throw new BadRequestError(
      //     "Your account has been suspended; please contact the administrator"
      //   );
      // }
      return user;
    });
  }
  /**
   *
   * @param refreshToken
   */
  logout(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      const refreshTokenDoc = yield Token_model_1.default.findOne({
        token: refreshToken,
        type: token_interface_1.TokenTypes.refresh,
        blacklisted: false,
      });
      if (!refreshTokenDoc) {
        throw new badRequest_error_1.BadRequestError("Invalid refresh token");
      }
      const updatedUser = yield User_model_1.default.findById(
        refreshTokenDoc.user
      );
      if (!updatedUser) {
        throw new badRequest_error_1.BadRequestError("No user found");
      }
      // updatedUser.active = false;
      yield updatedUser.save();
      yield refreshTokenDoc.remove();
    });
  }
  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  queryUsers(filter, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield User_model_1.default.paginate(filter, options);
      return results;
    });
  }
  /**
   *
   * @param id
   * @returns {Promise<UserDoc> }
   */
  getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findById(id);
      if (!user) {
        throw new badRequest_error_1.BadRequestError("User not found");
      }
      return user;
    });
  }
  /**
   *
   * @param id
   * @param updateBody
   * @param loggedUser
   * @returns { Promise<UserDoc>}
   */
  updateUser(id, updateBody, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserById(id);
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "No user exists with this ID!"
        );
      }
      if (loggedUser.suspend || user.suspend) {
        throw new badRequest_error_1.BadRequestError(
          "Your account has been suspended; please contact the administrator"
        );
      }
      if (loggedUser.role !== "Admin" && user.id !== loggedUser.id)
        throw new forbidden_error_1.ApiForbidden();
      Object.assign(user, updateBody);
      yield user.save();
      return user;
    });
  }
  /**
   *
   * @param id
   * @param loggedUser
   * @returns {Promise<message: string>}
   */
  deleteUser(id, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserById(id);
      if (loggedUser.suspend || user.suspend) {
        throw new badRequest_error_1.BadRequestError(
          "Your account has been suspended; please contact the administrator"
        );
      }
      if (loggedUser.role !== "Admin")
        throw new forbidden_error_1.ApiForbidden();
      yield user.remove();
      return { message: "User deleted successfully" };
    });
  }
  /**
   *
   * @param token
   * @param userId
   * @returns {Promise<status: boolean>}
   */
  addDevceToken(token, userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findById(userId);
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "No user exists with this ID!"
        );
      }
      (_a = user.deviceToken) === null || _a === void 0
        ? void 0
        : _a.push(token);
      yield user.save();
      return { success: true };
    });
  }
  /**
   *
   * @param email
   * @param oldPassword
   * @param newPassword
   * @returns {Promise<status: boolean>}
   */
  changePassword(email, oldPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOne({ email });
      if (!user) {
        throw new badRequest_error_1.BadRequestError("Email not found");
      }
      if (!(yield password_1.Password.compare(user.password, oldPassword))) {
        throw new badRequest_error_1.BadRequestError(
          "Old password does not match"
        );
      }
      user.password = newPassword;
      yield user.save();
      return { success: true };
    });
  }
  /**
   *
   * @param id
   * @param body
   * @param loggedUser
   * @returns { Promise<UserDoc>}
   */
  updateStatus(id, body, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserById(id);
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "No user exists with this ID!"
        );
      }
      if (loggedUser.suspend || user.suspend) {
        throw new badRequest_error_1.BadRequestError(
          "Your account has been suspended; please contact the administrator"
        );
      }
      if (loggedUser.role !== "Admin" && user.id !== loggedUser.id)
        throw new forbidden_error_1.ApiForbidden();
      Object.assign(user, body);
      yield user.save();
      return user;
    });
  }
  /**
   *
   * @param email
   * @returns {Promise<status: boolean>}
   */
  forgotPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOne({ email });
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "Invlid Email or Password"
        );
      }
      var otp = Math.floor(1000 + Math.random() * 9000);
      // @ts-ignore
      user.OTP["key"] = otp;
      yield user.save();
      const msg = {
        to: user.email,
        from: config_1.default.email.from,
        subject: "Forgot Password OTP",
        text: "This email is for forgot password",
        html: `
        <p>Use the below OTP for forgot password</p>
        <p>OTP: ${otp}</otp>
        `,
      };
      email_service_1.default
        .sendEmail(msg)
        .then((response) => {
          console.log("Email sent successfully!", response);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
      return { success: true };
    });
  }
  resetPassword(otp, email, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOne({ email });
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "Invlid Email or Password"
        );
      }
      // @ts-ignore
      if (user.OTP["key"] !== otp || user.OTP["key"] === null) {
        throw new badRequest_error_1.BadRequestError(
          "Bad OTP used for forgot password"
        );
      }
      user.password = newPassword;
      user.OTP["key"] = null;
      yield user.save();
      const msg = {
        to: user.email,
        from: config_1.default.email.from,
        subject: "Passwor change confirmation",
        text: "This email is for reset password",
        html: `
        <p>Your password has just been changed, you can login with your new password</p>
        `,
      };
      email_service_1.default.sendEmail(msg);
      return { success: true };
    });
  }
  /**
   *
   * @param id
   * @param body
   * @returns {Promise<success: boolean>}
   */
  updateUserByAdmin(id, body) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getUserById(id);
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "No user exists with this ID!"
        );
      }
      Object.assign(user, body);
      yield user.save();
      return { success: true };
    });
  }
  verifyEmail(token) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findOneAndUpdate(
        { verificationToken: token },
        { $set: { isVerified: true }, $unset: { verificationToken: 1 } },
        { new: true }
      );
      if (!user) {
        throw new badRequest_error_1.BadRequestError("Invalid token");
      }
      return user;
    });
  }
  updateSubscription(id, subscriptionId) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield User_model_1.default.findByIdAndUpdate(
        { _id: id }, // find a user by userId
        {
          $set: { subscription: subscriptionId, subscriptionDate: new Date() },
        }, // update subscriptionId
        { new: true, runValidators: true } // return updated user and run any validators on the model
      );
      if (!user) {
        throw new Error("User not found");
      }
      return user; // return the updated user
    });
  }
}
exports.default = new UserService();
