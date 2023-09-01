import {
  GameClubAttrs,
  GameClubDoc,
  GameClubUpdateAttrs,
} from "./entity/interface";
import GameClub from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";
import Portfolio from "../Portfolio/entity/model";
import { PlayerType } from "../Portfolio/entity/interface";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameClubDoc>}
   */
  public async create(body: GameClubAttrs): Promise<GameClubDoc> {
    if (await GameClub.findOne({ symbol: body.symbol })) {
      throw new BadRequestError("Symbol already taken");
    }
    const doc = await GameClub.build(body);
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
    const results = await GameClub.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param options
   * @returns {Promise<PaginationResult>}
   */

  public async getCompeteClubs(options: Options) {
    const portfolios = await Portfolio.find({ playerType: PlayerType.Bot });
    const ids = [...new Set(portfolios.map((e) => e.club._id))];
    const filter = { _id: { $in: ids } };
    return await this.query(filter, options);
  }
  /**
   *
   * @param id
   * @returns {Promise<GameClubDoc> }
   */
  public async get(id: string): Promise<GameClubDoc> {
    const doc = await GameClub.findById(id);
    if (!doc) {
      throw new BadRequestError("Game Club not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameClubDoc>}
   */
  public async update(
    id: string,
    updateBody: GameClubUpdateAttrs
  ): Promise<GameClubDoc> {
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
    return { message: "Game Club deleted successfully" };
  }
}

export default new Service();
