import {
  GameAttrs,
  GameDoc,
  GameModes,
  GameStatus,
  GameUpdateAttrs,
  PassBallAttrs,
} from "./entity/interface";
import Game from "./entity/model";
import { BadRequestError } from "../../errors/badRequest.error";
import { Options, PaginationResult } from "../../common/interfaces";
import { UserDoc } from "../User/entity/user.interface";
import GameModeService from "../GameModes/Service";
import { idlePlayerToMachineGame } from "./lib/idleP2M";
import { idlePlayerToPlayerGame } from "./lib/idleP2P";
import { realPlayerToPlayerGame } from "./lib/realP2P";
import { multiPlayerToPlayerGame } from "./lib/multiP2P";
import SellCoinService from "./api/sell-coin";
import BuyCoin from "./api/buy-coin";
import ChangeCoin from "./api/change-coin";
import { passBall } from "./api/pass-ball";
import { tacke } from "./api/tackle";
import { shoot } from "./api/shoot";
import BorrowMoney from "./api/borrow-money";

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameDoc>}
   */
  public async create(body: GameAttrs, user: UserDoc) {
    // check if both clubs are not same
    if (
      !body.club &&
      body.challengerClub?.toString() === body.rivalClub?.toString()
    ) {
      throw new BadRequestError("You can not compete with same club");
    }
    // check if player is already competing
    if (
      await Game.findOne({
        $or: [
          {
            challenger: user.id,
          },
          {
            rival: user.id,
          },
          { "rivalProtfolios.user": user.id },
          { "challengerClub.user": user.id },
        ],
      })
    ) {
      throw new BadRequestError(
        "You are already playing; the game is not over yet!"
      );
    }

    const gameMode = await GameModeService.get(body.gameMode.toString());
    switch (gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        return await idlePlayerToMachineGame(body, user, gameMode);
      case GameModes.IDLEP2P:
        return await idlePlayerToPlayerGame(body, user, gameMode);
      case GameModes.REALP2P:
        return await realPlayerToPlayerGame(body, user, gameMode);
      case GameModes.MULTP2P:
        return await multiPlayerToPlayerGame(body, user, gameMode);
    }
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
    const results = await Game.paginate(filter, options);
    return results;
  }

  /**
   *
   * @param id
   * @returns {Promise<GameDoc> }
   */
  public async get(id: string): Promise<GameDoc> {
    const doc = await Game.findById(id);
    if (!doc) {
      throw new BadRequestError("Game not found");
    }
    return doc;
  }

  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameDoc>}
   */
  public async update(
    id: string,
    updateBody: GameUpdateAttrs
  ): Promise<GameDoc> {
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
    return { message: "Game deleted successfully" };
  }

  public async sell(
    id: string,
    body: { portfolio: string; quantity: number; player: string },
    user: UserDoc
  ): Promise<GameDoc> {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError("Game is over or cancelled");
    }
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        await SellCoinService.idlePlayerToMachineSell(game, body, user);
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        await SellCoinService.idlePlayerToPlayerSell(game, body, user);
        break;
      case GameModes.MULTP2P:
        await SellCoinService.multiPlayerToPlayerSellCoin(game, body, user);
        break;
    }
    return game;
  }

  public async buy(
    id: string,
    body: { portfolio: string; quantity: number; player: string },
    user: UserDoc
  ): Promise<GameDoc> {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError("Game is over or cancelled");
    }
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        await BuyCoin.idlePlayerToMachineBuy(game, body, user);
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        await BuyCoin.idlePlayerToPlayerBuy(game, body, user);
        break;
      case GameModes.MULTP2P:
        await BuyCoin.multiPlayerToPlayerBuyCoin(game, body, user);
        break;
    }
    return game;
  }
  public async changeCoin(
    id: string,
    body: {
      currentPortfolio: string;
      newPortfolio: string;
      quantity: number;
      player: string;
    },
    user: UserDoc
  ): Promise<GameDoc> {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError("Game is over or cancelled");
    }
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        await ChangeCoin.idlePlayerToMachineChangeCoin(game, body, user);
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        await ChangeCoin.idlePlayerToPlayerChangeCoin(game, body, user);
        break;
      case GameModes.MULTP2P:
        console.log("mvp");
        await ChangeCoin.multiPlayerToPlayerChangeCoin(game, body, user);
        break;
    }
    return game;
  }

  public async borrowMoney(
    id: string,
    body: {
      portfolio: string;
      amount: number;
      player: string;
    },
    user: UserDoc
  ): Promise<GameDoc> {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError("Game is over or cancelled");
    }
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        console.log("pvm");
        await BorrowMoney.idlePlayerToMachineBorrowMoney(game, body, user);
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        console.log("pvp");
        await BorrowMoney.idlePlayerToPlayerBorrowMoney(game, body, user);
        break;
      case GameModes.MULTP2P:
        console.log("mvp");
        await BorrowMoney.multiPlayerToPlayerBorrowMoney(game, body, user);
        break;
    }
    return game;
  }
  public async passBall(gameId: string, body: PassBallAttrs, user: UserDoc) {
    const game = await this.get(gameId);
    return await passBall(game, body, user);
  }

  public async tackleBall(
    gameId: string,
    body: { player: string },
    user: UserDoc
  ) {
    const game = await this.get(gameId);
    return await tacke(game, body, user);
  }
  public async shootBall(
    gameId: string,
    body: { player: string },
    user: UserDoc
  ) {
    const game = await this.get(gameId);
    return await shoot(game, body, user);
  }
}

export default new Service();
