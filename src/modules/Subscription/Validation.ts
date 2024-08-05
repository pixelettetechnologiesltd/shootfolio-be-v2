import Joi from 'joi';
import { objectId } from '../../common/customeValidation';
import { SubscriptionTypes } from './entity/subscription.interface';

class SubscriptionValidation {
  constructor() {}

  public create() {
    return {
      body: Joi.object().keys({
        name: Joi.string().required(),
        leagues: Joi.array().items(Joi.string().custom(objectId)),
        amount: Joi.number().required(),
      }),
    };
  }

  public subscribe() {
    return {
      body: Joi.object().keys({
        subscriptionId: Joi.string().custom(objectId).required(),
      }),
    };
  }
  public upgradeSubscription() {
    return {
      body: Joi.object().keys({
        subscriptionId: Joi.string().custom(objectId).required(),
      }),
    };
  }
  public querySubscription() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
        })
        .max(6),
    };
  }

  public update() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().required(),
        })
        .min(1)
        .max(1),
      body: Joi.object().keys({
        name: Joi.string(),
        leagues: Joi.array().items(Joi.string().custom(objectId)),
        amount: Joi.number(),
        status: Joi.boolean(),
      }),
    };
  }
  public getSubscription() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().required(),
        })
        .min(1)
        .max(1),
    };
  }
  public deleteSubscription() {
    return {
      params: Joi.object()
        .keys({
          id: Joi.string().required(),
        })
        .min(1)
        .max(1),
    };
  }
}

export default new SubscriptionValidation();
