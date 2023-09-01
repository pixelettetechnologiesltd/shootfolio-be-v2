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
const Admin_model_1 = __importDefault(require("./entity/Admin.model"));
const badRequest_error_1 = require("../../errors/badRequest.error");
const password_1 = require("../../common/services/password");
const token_interface_1 = require("../Tokens/entity/token.interface");
const Token_model_1 = __importDefault(require("../Tokens/entity/Token.model"));
const forbidden_error_1 = require("../../errors/forbidden.error");
class AdminService {
  constructor() {}
  /**
   *
   * @param userBody
   * @returns  {Promise<AdminDoc>}
   */
  register(userBody) {
    return __awaiter(this, void 0, void 0, function* () {
      if (yield Admin_model_1.default.isEmailTaken(userBody.email)) {
        throw new badRequest_error_1.BadRequestError("Email already exists!");
      }
      const user = yield Admin_model_1.default.build(userBody);
      yield user.save();
      return user;
    });
  }
  /**
   *
   * @param email
   * @param password
   * @returns {Promise<AdminDoc>}
   */
  login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield Admin_model_1.default.findOne({ email });
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
      const updatedUser = yield Admin_model_1.default.findById(
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
  queryAdmin(filter, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield Admin_model_1.default.paginate(filter, options);
      return results;
    });
  }
  /**
   *
   * @param id
   * @returns {Promise<AdminDoc> }
   */
  getAdminById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield Admin_model_1.default.findById(id);
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
   * @returns { Promise<AdminDoc>}
   */
  updateAdmin(id, updateBody, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getAdminById(id);
      if (!user) {
        throw new badRequest_error_1.BadRequestError(
          "No user exists with this ID!"
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
  deleteAdmin(id, loggedUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.getAdminById(id);
      if (loggedUser.role !== "Admin")
        throw new forbidden_error_1.ApiForbidden();
      yield user.remove();
      return { message: "User deleted successfully" };
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
      const user = yield Admin_model_1.default.findOne({ email });
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
}
exports.default = new AdminService();
