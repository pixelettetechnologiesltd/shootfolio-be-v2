import {
  GameLeagueAttrs,
  GameLeagueDoc,
  GameLeagueUpdateAttrs,
} from "./entity/interface";
import GameLeague from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameLeagueDoc>}
   */
  public async create(body: GameLeagueAttrs): Promise<GameLeagueDoc> {
    const doc = await GameLeague.build(body);
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
    const results = await GameLeague.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameLeagueDoc> }
   */
  public async get(id: string): Promise<GameLeagueDoc> {
    const doc = await GameLeague.findById(id);
    if (!doc) {
      throw new BadRequestError("Game League not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameLeagueDoc>}
   */
  public async update(
    id: string,
    updateBody: GameLeagueUpdateAttrs
  ): Promise<GameLeagueDoc> {
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
    return { message: "Game League deleted successfully" };
  }
}

export default new Service();
