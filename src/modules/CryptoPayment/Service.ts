import {
  CryptoPaymentAttrs,
  CryptoPaymentDoc,
  CryptoPaymentUpdateAttrs,
} from './entity/interface';
import CryptoPayment from './entity/modal';
import { Options, PaginationResult } from '../../common/interfaces';
import { BadRequestError } from '../../errors/badRequest.error';

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<CryptoPaymentDoc>}
   */
  public async create(body: CryptoPaymentAttrs): Promise<CryptoPaymentDoc> {
    const doc = await CryptoPayment.build(body);
    await doc.save();
    return doc;
  }

  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  public async query(
    filter: object,
    options: Options
  ): Promise<PaginationResult> {
    const results = await CryptoPayment.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameTypeDoc> }
   */
  public async get(id: string): Promise<CryptoPaymentDoc> {
    const doc = await CryptoPayment.findById(id);
    if (!doc) {
      throw new BadRequestError('Document not found');
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<CryptoPaymentDoc>}
   */
  public async update(
    id: string,
    updateBody: CryptoPaymentUpdateAttrs
  ): Promise<CryptoPaymentDoc> {
    const doc = await this.get(id);
    Object.assign(doc, updateBody);
    await doc.save();
    return doc;
  }
}
export default new Service();
