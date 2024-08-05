import Stripe from 'stripe';
import config from '../../config/config';
import { UserDoc } from '../User/entity/user.interface';
import {
  SubscriptionAttrs,
  SubscriptionDoc,
} from './entity/subscription.interface';
import Subscription from './entity/Subscription.Model';
import { BadRequestError } from '../../errors/badRequest.error';
import {
  Options,
  PaginationResult,
} from '../../common/interfaces/paginates.interface';
import mongoose from 'mongoose';
import Card from '../Card/entity/creditCard.Model';
import User from '../User/entity/User.model';
import { Logger } from '../../config/logger';
import { Request } from 'express';
const client = new Stripe(config.stripe.key, {
  apiVersion: '2022-11-15',
});

class SubscriptionService {
  constructor() {}

  public async create(body: SubscriptionAttrs): Promise<SubscriptionDoc> {
    if (await Subscription.isSubscriptionNameTaken(body.name)) {
      throw new BadRequestError('Subscription name already exists');
    }

    try {
      // create product on stripe
      const product = await client.products.create({
        name: body.name,
        metadata: {
          leauges: JSON.stringify(
            body.leagues.reduce(
              (acc: any, next: mongoose.Types.ObjectId, index: number) => {
                acc[index] = next.toString();
                return acc;
              },
              {}
            )
          ),
        },
      });

      // create price on stripe
      const price = await client.prices.create({
        currency: 'usd',
        unit_amount: body.amount,
        recurring: { interval: 'month' },
        product: product.id,
      });

      const subscription = await Subscription.build({
        ...body,
      });
      subscription.priceId = price.id;
      subscription.productId = product.id;
      await subscription.save();

      return subscription;
    } catch (error) {
      Logger.error(error);
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      } else {
        throw new BadRequestError('Something went wrong');
      }
    }
  }

  public async subscribe(
    user: UserDoc,
    subscriptionId: string
  ): Promise<UserDoc> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new BadRequestError('Subscription not found');
    }
    const customer = await Card.findOne({ user: user.id });
    if (!customer) {
      throw new BadRequestError('You dont have any cards yet, add card first');
    }
    const stripeSUbscription = await client.subscriptions.create({
      customer: customer.customer_id,
      items: [{ price: subscription.priceId }],
      default_payment_method: customer.payment_id,
    });
    customer.subscription_id = subscription.priceId;
    await customer.save();
    await User.updateOne(
      { _id: user.id },
      { $set: { subscription: subscription._id, subId: stripeSUbscription.id } }
    );
    // @ts-ignore
    return await User.findById(user.id).populate('subscription');
  }

  /**
   *
   * @param id
   * @param body
   * @returns {Promise<{success: boolean}>}
   */
  public async upgradeSubscription(
    user: UserDoc,
    subscriptionId: string
  ): Promise<UserDoc> {
    if (!user.subscription) {
      throw new BadRequestError("You don't have any subscription yet!");
    }
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new BadRequestError('No subscription found!');
    }
    const card = await Card.findOne({ user: user.id });
    if (!card?.subscription_id) {
      throw new BadRequestError("You don't have any subscription yet!");
    }

    try {
      // @ts-ignore
      const oldSubscription = await client.subscriptions.retrieve(user.subId);
      if (oldSubscription.id === card.subscription_id) {
        throw new Error(
          'You already subscribed to this subscription, please upgrade'
        );
      }
      const customer = await Card.findOne({ user: user.id });
      if (!customer) {
        throw new BadRequestError(
          'You dont have any cards yet, add card first'
        );
      }

      // @ts-ignore
      await client.subscriptions.del(user.subId);

      const stripeSUbscription = await client.subscriptions.create({
        customer: customer.customer_id,
        items: [{ price: subscription.priceId }],
        default_payment_method: customer.payment_id,
      });
      customer.subscription_id = subscription.priceId;
      await customer.save();
      await User.updateOne(
        { _id: user.id },
        {
          $set: {
            subscription: subscription._id,
            subId: stripeSUbscription.id,
          },
        }
      );
      await user.save();
    } catch (error) {
      Logger.error(error);
      if (error instanceof Error) throw new BadRequestError(error.message);
      throw new BadRequestError('Something went wrong');
    }
    await subscription.save();
    // @ts-ignore
    return await User.findById(user.id).populate('subscription');
  }

  /**
   *
   * @param id
   * @param body
   * @returns {Promise<{success: boolean}>}
   */
  public async cancelSubscription(user: UserDoc): Promise<UserDoc> {
    if (!user.subscription) {
      throw new BadRequestError("You don't have any subscription yet!");
    }
    const card = await Card.findOne({ user: user.id });
    if (!card?.subscription_id) {
      throw new BadRequestError("You don't have any subscription yet!");
    }
    try {
      // @ts-ignore
      await client.subscriptions.del(user.subId);
      card.subscription_id = null;
      await card.save();
      user.subscription = null;
      user.subId = null;
      user.save();
    } catch (error) {
      Logger.error(error);
      if (error instanceof Error) throw new BadRequestError(error.message);
      throw new BadRequestError('Something went wrong');
    }
    // @ts-ignore
    return await user;
  }

  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  public async querySubscription(
    filter: {},
    options: Options
  ): Promise<PaginationResult> {
    return await Subscription.paginate(filter, options);
  }

  /**
   *
   * @param id
   * @returns {Promise<CopounDoc>}
   */
  public async getSubscription(id: string) {
    return await Subscription.findById(id);
  }

  /**
   *
   * @param id
   * @param body
   * @returns {Promise<CopounDoc>}
   */
  public async updateSubscription(
    id: string,
    body: Partial<SubscriptionAttrs>
  ) {
    const subscription = await this.getSubscription(id);
    if (!subscription) {
      throw new BadRequestError('No subscription found!');
    }

    Object.assign(subscription, body);
    await subscription.save();
    return subscription;
  }

  /**
   *
   * @param id
   * @returns {Promise<{success: boolean}>}
   */
  public async deleteSubscription(id: string): Promise<{ success: boolean }> {
    const subscription = await this.getSubscription(id);
    if (!subscription) {
      throw new BadRequestError('No subscription found!');
    }

    await client.subscriptions.del(subscription.id);
    await subscription.remove();
    await subscription.save();
    return { success: true };
  }

  public async handleFailedPayments(req: Request) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      if (sig) {
        event = client.webhooks.constructEvent(
          req.body,
          sig,
          config.stripe.webHookKey
        );
        switch (event.type) {
          case 'invoice.payment_failed':
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = invoice.subscription;

            console.log(`Payment failed for subscription: ${subscriptionId}`);
            const user = await User.findOne({ subId: subscriptionId });
            if (user) {
              // @ts-ignore
              user?.subscription = null;
              // @ts-ignore
              user?.subId = null;
              await user?.save();
              break;
            }

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }
      }
    } catch (err) {
      console.error(err);
      throw new Error('Internal server error');
    }
  }
}

export default new SubscriptionService();
