import {
  GameTypeAttrs,
  GameTypeDoc,
  GameTypeUpdateAttrs,
} from "./entity/interface";
import GameType from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameTypeDoc>}
   */
  public async create(body: GameTypeAttrs): Promise<GameTypeDoc> {
    const doc = await GameType.build(body);
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
    const results = await GameType.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameTypeDoc> }
   */
  public async get(id: string): Promise<GameTypeDoc> {
    const doc = await GameType.findById(id);
    if (!doc) {
      throw new BadRequestError("Gametype not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameTypeDoc>}
   */
  public async update(
    id: string,
    updateBody: GameTypeUpdateAttrs
  ): Promise<GameTypeDoc> {
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
    return { message: "Game type deleted successfully" };
  }
}

export default new Service();
