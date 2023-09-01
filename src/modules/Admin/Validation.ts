import Joi from "joi";
import { objectId, password } from "../../common/customeValidation";

class AdminValidation {
  constructor() {}

  public register() {
    return {
      body: Joi.object().keys({
        userName: Joi.string(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().optional(),
      }),
    };
  }

  public login() {
    return {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    };
  }

  public logout() {
    return {
      body: Joi.object().keys({
        refreshToken: Joi.string().required(),
      }),
    };
  }

  public queryAdmin() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
        })
        .max(2),
    };
  }

  public updateAdmin() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),

      body: Joi.object()
        .keys({
          email: Joi.string().custom(password).optional(),
          userName: Joi.string().custom(password).optional(),
          password: Joi.string().custom(password).optional(),
          name: Joi.string().optional(),
          role: Joi.string(),
        })
        .min(0)
        .max(5),
    };
  }
  public getAdminById() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }
  public deleteAdmin() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }

  public changePassword() {
    return {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
      }),
    };
  }
  public forgotPassword() {
    return {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
      }),
    };
  }

  public resetPassword() {
    return {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.number().required(),
        newPassword: Joi.string().required(),
      }),
    };
  }
}

export default new AdminValidation();
