import Joi from "joi";
import { objectId } from "../../common/customeValidation";
import { GameTypeStatus } from "./entity/interface";

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object()
        .keys({
          gameTitle: Joi.string().required(),
          status: Joi.string()
            .valid(...Object.keys(GameTypeStatus))
            .required(),
        })
        .min(2)
        .max(2),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          status: Joi.string().valid(...Object.keys(GameTypeStatus)),
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
        iconUrl: Joi.string().valid(null, "").allow().optional(),
        gameTitle: Joi.string(),
        status: Joi.string().valid(...Object.keys(GameTypeStatus)),
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
