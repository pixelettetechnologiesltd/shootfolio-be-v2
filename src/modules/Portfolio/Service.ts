import {
  PortolioAttrs,
  PortolioDoc,
  PortolioUpdateAttrs,
} from "./entity/interface";
import Portfolio from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";
import CryptoService from "../CryptoCoins/Service";
class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<PortolioDoc>}
   */
  public async create(body: PortolioAttrs): Promise<PortolioDoc> {
    if (body.admin !== null && body.admin !== undefined) {
      if (
        (await Portfolio.countDocuments({
          club: body.club,
          admin: { $ne: null },
        })) >= 5
      ) {
        throw new BadRequestError(
          "You can not create more then 5 portfolios for single club"
        );
      }
    }
    const doc = await Portfolio.build(body);
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
    const results = await Portfolio.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<PortolioDoc> }
   */
  public async get(id: string): Promise<PortolioDoc> {
    const doc = await Portfolio.findById(id);
    if (!doc) {
      throw new BadRequestError("Portfolio not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<PortolioDoc>}
   */
  public async update(
    id: string,
    updateBody: PortolioUpdateAttrs
  ): Promise<PortolioDoc> {
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
    return { message: "Portfolio deleted successfully" };
  }
}

export default new Service();
