import { GameHistoryttrs, GameHistoryDoc } from "./entity/interface";
import GameHistory from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameHistoryDoc>}
   */
  public async create(body: GameHistoryttrs): Promise<GameHistoryDoc> {
    const doc = await GameHistory.build(body);
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
    const results = await GameHistory.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameModeDoc> }
   */
  public async get(id: string): Promise<GameHistoryDoc> {
    const doc = await GameHistory.findById(id);
    if (!doc) {
      throw new BadRequestError("Game Mode not found");
    }
    return doc;
  }
}

export default new Service();
