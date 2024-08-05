import Joi from 'joi';
import { objectId } from '../../common/customeValidation';
import { GameStatus, PlayerRoles } from './entity/interface';

class Validation {
  constructor() {}

  public create() {
    return {
      body: Joi.object().keys({
        rivalClub: Joi.string().custom(objectId).allow(null, '').optional(),
        challengerClub: Joi.string()
          .custom(objectId)
          .allow(null, '')
          .optional(),
        portfolios: Joi.array()
          .items(
            Joi.object().keys({
              portfolio: Joi.string().custom(objectId).required(),
              quantity: Joi.number().required(),
              role: Joi.string()
                .valid(...Object.keys(PlayerRoles))
                .allow(null, '')
                .optional(),
            })
          )
          .required()
          .max(5),
        gameMode: Joi.string().custom(objectId).required(),
        leauge: Joi.string().custom(objectId).required(),
        gameId: Joi.string().custom(objectId).allow(null, '').optional(),
        club: Joi.string().custom(objectId).allow(null, '').optional(),
      }),
    };
  }

  public query() {
    return {
      query: Joi.object()
        .keys({
          limit: Joi.number().optional(),
          page: Joi.number().optional(),
          user: Joi.string().custom(objectId),
          rivalClub: Joi.string().custom(objectId),
          challengerClub: Joi.string().custom(objectId),
          gameMode: Joi.string().custom(objectId),
          status: Joi.string().valid(...Object.keys(GameStatus)),
          leauge: Joi.string().custom(objectId),
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
        iconUrl: Joi.string().valid(null, '').allow().optional(),
        gameTitle: Joi.string(),
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
  public sell() {
    return {
      body: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
        portfolio: Joi.string().custom(objectId).required(),
        quantity: Joi.number().required(),
        player: Joi.string().valid('rival', 'challenger'),
      }),
    };
  }
  public changeCoin() {
    return {
      body: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
        currentPortfolio: Joi.string().custom(objectId).required(),
        newPortfolio: Joi.string().custom(objectId).required(),
        quantity: Joi.number().required(),
        player: Joi.string().valid('rival', 'challenger'),
      }),
    };
  }
  public borrowMoney() {
    return {
      body: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
        portfolio: Joi.string().custom(objectId).required(),
        amount: Joi.number().required(),
        player: Joi.string().valid('rival', 'challenger').required(),
      }),
    };
  }
  public borrowedMoney() {
    return {
      params: Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
      }),
      query: Joi.object().keys({
        portfolio: Joi.string().custom(objectId),
        player: Joi.string().valid('rival', 'challenger').required(),
      }),
    };
  }
  public passBall() {
    return {
      body: Joi.object()
        .keys({
          gameId: Joi.string().custom(objectId).required(),
          portfolio: Joi.string().custom(objectId).required(),
          player: Joi.string().valid('rival', 'challenger').required(),
        })
        .min(3)
        .max(3),
    };
  }

  public tackle() {
    return {
      body: Joi.object().keys({
        gameId: Joi.string().custom(objectId).required(),
        player: Joi.string().valid('rival', 'challenger').required(),
      }),
    };
  }

  public quizAnswer() {
    return {
      body: Joi.object().keys({
        gameId: Joi.string().custom(objectId).required(),
        quizId: Joi.string().custom(objectId).required(),
        answer: Joi.number().required(),
        player: Joi.string().valid('rival', 'challenger').required(),
      }),
    };
  }
}

export default new Validation();
