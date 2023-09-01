import {
  GameModeAttrs,
  GameModeDoc,
  GameModeUpdateAttrs,
} from "./entity/interface";
import GameMode from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameModeDoc>}
   */
  public async create(body: GameModeAttrs): Promise<GameModeDoc> {
    const doc = await GameMode.build(body);
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
    const results = await GameMode.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameModeDoc> }
   */
  public async get(id: string): Promise<GameModeDoc> {
    const doc = await GameMode.findById(id);
    if (!doc) {
      throw new BadRequestError("Game Mode not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameModeDoc>}
   */
  public async update(
    id: string,
    updateBody: GameModeUpdateAttrs
  ): Promise<GameModeDoc> {
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
    return { message: "Game Mode deleted successfully" };
  }
}

export default new Service();
