import Joi from "joi";
import { objectId } from "../../common/customeValidation";

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object()
        .keys({
          gameTypeId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          title: Joi.string().required(),
          symbol: Joi.string().min(3).max(3).required(),
          status: Joi.boolean().required(),
        })
        .min(4)
        .max(4),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          gameTypeId: Joi.string().custom(objectId).optional(),
          status: Joi.boolean().allow().optional(),
        })
        .max(3),
    };
  }

  public update() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),

      body: Joi.object().keys({
        gameTypeId: Joi.string().custom(objectId),
        title: Joi.string().optional(),
        logo: Joi.string().optional(),
        symbol: Joi.string().min(3).max(3).optional(),
        status: Joi.boolean().optional(),
      }),
    };
  }
  public get() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }
  public delete() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }
}

export default new Validation();
