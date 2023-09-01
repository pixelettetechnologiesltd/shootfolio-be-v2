import Joi from 'joi';
import { objectId } from '../../common/customeValidation';
import { CryptoPaymentStatus } from './entity/interface';

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object()
        .keys({
          subscription: Joi.string()
            .custom(objectId)
            .required()
            .description('subscription id is required'),
          paymentMethod: Joi.string()
            .required()
            .description('payment method is required'),
          transactionHash: Joi.string()
            .required()
            .description('transaction hash is required'),
          //   status: Joi.string()
          //     .valid(...Object.keys(CryptoPaymentStatus))
          //     .required(),
        })
        .min(3)
        .max(3),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          status: Joi.string().valid(...Object.keys(CryptoPaymentStatus)),
          user: Joi.string().custom(objectId),
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
        status: Joi.string().valid('Approve', 'Reject').required(),
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
}

export default new Validation();
