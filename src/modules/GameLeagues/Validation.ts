import Joi from 'joi';
import { objectId } from '../../common/customeValidation';

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object()
        .keys({
          gameTypeId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          gameModeId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          leagueTitle: Joi.string().required(),
          investableBudget: Joi.number().required(),
          status: Joi.bool().required(),
          borrowAmount: Joi.number().required(),
        })
        .min(6)
        .max(6),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          gameTypeId: Joi.string().custom(objectId).allow(null, '').optional(),
          gameModeId: Joi.string().custom(objectId).allow(null, '').optional(),
          status: Joi.boolean().allow().optional(),
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
        gameTypeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        gameModeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        leagueTitle: Joi.string(),
        investableBudget: Joi.number(),
        status: Joi.bool(),
        borrowAmount: Joi.number(),
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
