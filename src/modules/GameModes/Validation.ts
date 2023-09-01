import Joi from "joi";
import { objectId } from "../../common/customeValidation";

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object()
        .keys({
          gameType: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          modeTitle: Joi.string().required(),
          duration: Joi.string().required(),
          status: Joi.bool().required(),
          quiz: Joi.bool().required(),
        })
        .min(5)
        .max(5),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          gameType: Joi.string().custom(objectId).allow(null, "").optional(),
        })
        .max(2),
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
        gameType: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        modeTitle: Joi.string(),
        duration: Joi.string(),
        status: Joi.bool(),
        quiz: Joi.bool(),
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
