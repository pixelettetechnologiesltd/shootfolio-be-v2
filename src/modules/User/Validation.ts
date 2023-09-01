import Joi from 'joi';
import { objectId, password } from '../../common/customeValidation';

class UserValidation {
  constructor() {}

  public register() {
    return {
      body: Joi.object().keys({
        userName: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        walletAddress: Joi.string().optional(),
        role: Joi.string().optional(),
      }),
    };
  }

  public socialLogin() {
    return {
      body: Joi.object().keys({
        userName: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        // password: Joi.string().required(),
        // walletAddress: Joi.string().optional(),
        // role: Joi.string().optional(),
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

  public queryUsers() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
        })
        .max(2),
    };
  }

  public updateUser() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),

      body: Joi.object()
        .keys({
          userName: Joi.string().optional(),
          password: Joi.string().custom(password).optional(),
          name: Joi.string().optional(),
          email: Joi.string().email().optional(),
          photoPath: Joi.string().optional(),
          deviceToken: Joi.array(),
          role: Joi.string(),
        })
        .min(0)
        .max(6),
    };
  }
  public getUserById() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }
  public deleteUser() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }

  public addDeviceToken() {
    return {
      body: Joi.object()
        .keys({
          token: Joi.string().required(),
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

  public updateUserStatus() {
    return {
      params: Joi.object().keys({
        id: Joi.string().custom(objectId),
      }),
      body: {
        status: Joi.string().valid('active', 'inactive').required(),
      },
    };
  }

  public updateUserByAdmin() {
    return {
      params: Joi.object().keys({
        id: Joi.string().custom(objectId),
      }),
      body: {
        name: Joi.string().optional(),
        userName: Joi.string().optional(),
      },
    };
  }

  public verifyToken() {
    return {
      params: Joi.object().keys({
        token: Joi.string().required(),
      }),
    };
  }

  public updateSubscription() {
    return {
      params: Joi.object().keys({
        id: Joi.string().custom(objectId),
      }),
      body: Joi.object()
        .keys({
          subscriptionId: Joi.string().custom(objectId),
        })
        .min(1)
        .max(1),
    };
  }
}

export default new UserValidation();
