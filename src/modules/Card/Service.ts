import { BadRequestError } from '../../errors/badRequest.error';
import { Password } from '../../common/services/password';
import { TokenTypes } from '../Tokens/entity/token.interface';
import Token from '../Tokens/entity/Token.model';
import { Options, PaginationResult } from '../../common/interfaces';
import { ApiForbidden } from '../../errors/forbidden.error';
import config from '../../config/config';
import Stripe from 'stripe';
import Card from './entity/creditCard.Model';
import {
  CardDoc,
  CardAttrs,
  CardUpdateAttrs,
  CardModel,
} from './entity/crad.interface';
import { UserDoc } from '../User/entity/user.interface';
import { Logger } from '../../config/logger';
import User from '../User/entity/User.model';

const client = new Stripe(config.stripe.key, {
  apiVersion: '2022-11-15',
});

class CardService {
  constructor() {}

  /**
   *
   * @param userBody
   * @returns  {Promise<UserDoc>}
   */
  public async create(
    cardBody: CardAttrs,
    user: UserDoc
  ): Promise<{ success: boolean; message: string }> {
    const customer = await client.customers.search({
      query: `email:'${user.email}'`,
    });
    if (!customer.data.length) {
      try {
        const paymentMethod = await client.paymentMethods.create({
          type: 'card',
          card: {
            number: cardBody.number,
            exp_month: cardBody.exp_month,
            exp_year: cardBody.exp_year,
            cvc: cardBody.cvc,
          },
        });
        const newCustomer = await client.customers.create({
          payment_method: paymentMethod.id,
          name: user.name,
          email: user.email,
        });

        const payment = await client.paymentMethods.attach(paymentMethod.id, {
          customer: newCustomer.id,
        });

        const card = await Card.updateOne(
          { user: user.id },
          {
            customer_id: newCustomer.id,
            payment_id: paymentMethod.id,
            user: user.id,
            address: {
              city: cardBody.city,
              line1: cardBody.line1,
              line2: cardBody.line2,
              postal_code: cardBody.postal_code,
              state: cardBody.state,
              country: cardBody.state,
            },
            card: {
              number: cardBody.number,
              exp_month: cardBody.exp_month,
              exp_year: cardBody.exp_year,
              cvc: cardBody.cvc,
            },
          },
          { upsert: true }
        );
        return { success: true, message: 'Card addedd successfully' };
      } catch (error) {
        Logger.error(error);
        if (error instanceof Error) {
          throw new BadRequestError(error.message);
        }
        throw new BadRequestError('Somthing went wrong');
      }
    }
    return { success: false, message: 'You aleady added a card' };
  }

  /**
   *
   * @param id
   * @returns {Promise<CardDoc> }
   */
  public async getCard(id: string): Promise<CardDoc> {
    const card = await Card.findById(id);
    if (!card) {
      throw new BadRequestError('User not found');
    }
    return card;
  }

  /**
   *
   * @param id
   * @returns {Promise<CardDoc> }
   */
  public async getCardLoggedUser(user: UserDoc): Promise<CardDoc | {}> {
    const card = await Card.findOne({ user: user.id });
    if (!card) {
      return {};
    }
    return card;
  }

  /**
   *
   * @param id
   * @param loggedUser
   * @returns {Promise<message: string>}
   */
  public async deleteCard(loggedUser: UserDoc): Promise<{ message: string }> {
    const card = await this.getCardLoggedUser(loggedUser);
    if (!Object.keys(card).length) {
      throw new BadRequestError('Card not found');
    }
    try {
      if (Object.keys(card).length) {
        // @ts-ignore
        await client.customers.del(card.customer_id);
        loggedUser.subscription = null;
        await loggedUser.save();
        // @ts-ignore
        await card.remove();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      }
      console.log(error);
    }
    return { message: 'Card remove successfully' };
  }
}

export default new CardService();
