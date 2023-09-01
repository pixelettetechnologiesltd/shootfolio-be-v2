import { CoinsDoc, CoinsUpdateAttrs } from "./entity/interface";
import Coins from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";

class Service {
  constructor() {}
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
    const results = await Coins.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<CoinsDoc> }
   */
  public async get(id: string): Promise<CoinsDoc> {
    const doc = await Coins.findById(id);
    if (!doc) {
      throw new BadRequestError("Asset not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<CoinsDoc>}
   */
  public async update(
    id: string,
    updateBody: CoinsUpdateAttrs
  ): Promise<CoinsDoc> {
    const doc = await this.get(id);
    Object.assign(doc, updateBody);
    await doc.save();
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
    return { message: "Asset deleted successfully" };
  }
}

export default new Service();
