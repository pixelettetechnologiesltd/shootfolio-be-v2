import Joi from 'joi';
import { objectId, password } from '../../common/customeValidation';

class CardValidation {
  constructor() {}
  public create() {
    return {
      body: Joi.object().keys({
        city: Joi.string(),
        line1: Joi.string(),
        line2: Joi.string(),
        postal_code: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        name: Joi.string().required().label('Card holder name is required'),
        number: Joi.string().required(),
        exp_month: Joi.number().required(),
        exp_year: Joi.number().required(),
        cvc: Joi.string().required(),
      }),
    };
  }

  public updateCard() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
      body: Joi.object().keys({
        address: Joi.object().keys({
          city: Joi.string(),
          line1: Joi.string(),
          line2: Joi.string(),
          postal_code: Joi.string(),
          state: Joi.string(),
          country: Joi.string(),
        }),
        card: Joi.object().keys({
          name: Joi.string().required(),
          number: Joi.string().required(),
          exp_month: Joi.string().required(),
          exp_year: Joi.string().required(),
          cvc: Joi.string().required(),
        }),
      }),
    };
  }
  public getCard() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().custom(objectId).required(),
        })
        .min(1)
        .max(1),
    };
  }
  public deleteCard() {
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

export default new CardValidation();
