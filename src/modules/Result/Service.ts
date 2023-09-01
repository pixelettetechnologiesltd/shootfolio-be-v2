import { ResultAttrs, ResultDoc, ResultModal } from './entity/interface';
import Result from './entity/modal';
import { BadRequestError } from '../../errors/badRequest.error';
import { Options, PaginationResult } from '../../common/interfaces';

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns {Promise<ResultDoc>}
   */
  public async create(body: ResultAttrs): Promise<ResultDoc> {
    const doc = await Result.build(body);
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
    const results = await Result.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<ResultDoc> }
   */
  public async get(id: string): Promise<ResultDoc> {
    const doc = await Result.findById(id);
    if (!doc) {
      throw new BadRequestError('Result not found');
    }
    return doc;
  }

  /**
   *
   * @param id
   * @returns {Promise<message: string>}
   */
  public async delete(id: string): Promise<{ message: string }> {
    const doc = await this.get(id);
    await doc.remove();
    return { message: 'Result deleted successfully' };
  }
}

export default new Service();
