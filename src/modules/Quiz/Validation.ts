import Joi from 'joi';
import { objectId } from '../../common/customeValidation';

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().required(),
        correctOption: Joi.number().required(),
      }),
    };
  }

  public query() {
    return {
      query: Joi.object().keys({
        limit: Joi.number().optional(),
        page: Joi.number().optional(),
      }),
    };
  }

  public answerSubmit() {
    return {
      body: Joi.object().keys({
        questionId: Joi.string().custom(objectId).required(),
        answer: Joi.number().max(3).min(0),
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
  public update() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
      body: Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().required(),
        correctOption: Joi.number().required(),
      }),
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
