import Joi from "joi";
import { objectId } from "../../common/customeValidation";
import { PlayerType } from "./entity/interface";

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object().keys({
        admin: Joi.string().custom(objectId),
        user: Joi.string().custom(objectId),
        coin: Joi.string().custom(objectId).required(),
        club: Joi.string().custom(objectId).required(),
        quantity: Joi.number().required(),
      }),
    };
  }

  public query() {
    return {
      query: Joi.object().keys({
        limit: Joi.number().optional(),
        page: Joi.number().optional(),
        user: Joi.string().custom(objectId),
        admin: Joi.string().custom(objectId),
        club: Joi.string().custom(objectId),
      }),
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
        admin: Joi.string().custom(objectId),
        user: Joi.string().custom(objectId),
        coin: Joi.string().custom(objectId),
        club: Joi.string().custom(objectId),
        quantity: Joi.number(),
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
