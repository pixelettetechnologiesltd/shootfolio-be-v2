import Joi from "joi";
import { objectId } from "../../common/customeValidation";

class Validation {
  constructor() {}
  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          game: Joi.string().custom(objectId).allow(null, "").optional(),
          user: Joi.string().custom(objectId).allow(null, "").optional(),
        })
        .max(2),
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
}

export default new Validation();
