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
}

export default new Validation();
