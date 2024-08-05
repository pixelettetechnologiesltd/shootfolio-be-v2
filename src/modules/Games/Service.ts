import {
  GameAttrs,
  GameDoc,
  GameModes,
  GameStatus,
  GameUpdateAttrs,
  PassBallAttrs,
  PortfolioSelect,
  PlayerRoles,
} from './entity/interface';
import Game from './entity/model';
import { BadRequestError } from '../../errors/badRequest.error';
import { Options, PaginationResult } from '../../common/interfaces';
import { UserDoc } from '../User/entity/user.interface';
import GameModeService from '../GameModes/Service';
import { idlePlayerToMachineGame } from './lib/idleP2M';
import { idlePlayerToPlayerGame } from './lib/idleP2P';
import { realPlayerToPlayerGame } from './lib/realP2P';
import { multiPlayerToPlayerGame } from './lib/multiP2P';
import SellCoinService from './api/sell-coin';
import BuyCoin from './api/buy-coin';
import ChangeCoin from './api/change-coin';
import { passBall } from './api/pass-ball';
import { tacke } from './api/tackle';
import { shoot } from './api/shoot';
import BorrowMoney from './api/borrow-money';
import { findPortfolio } from './lib/utils';
import mongoose from 'mongoose';
import Quiz from '../Quiz/entity/modal';

class Service {
  constructor() {}

  /**
   *
   * @param body
   * @returns  {Promise<GameDoc>}
   */
  public async create(body: GameAttrs, user: UserDoc) {
    console.log('user===', user);

    // check if both clubs are not same
    if (
      !body.club &&
      body.challengerClub?.toString() === body.rivalClub?.toString()
    ) {
      throw new BadRequestError('You can not compete with same club');
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
          { 'rivalProtfolios.user': user.id },
          { 'challengerClub.user': user.id },
        ],
        $and: [{ status: !GameStatus.Over }],
      })
    ) {
      throw new BadRequestError(
        'You are already playing; the game is not over yet!'
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
      throw new BadRequestError('Game not found');
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
    return { message: 'Game deleted successfully' };
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
      throw new BadRequestError('Game is over or cancelled');
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
      throw new BadRequestError('Game is over or cancelled');
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
      throw new BadRequestError('Game is over or cancelled');
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
        console.log('mvp');
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
      throw new BadRequestError('Game is over or cancelled');
    }
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        console.log('pvm');
        await BorrowMoney.idlePlayerToMachineBorrowMoney(game, body, user);
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        console.log('pvp');
        await BorrowMoney.idlePlayerToPlayerBorrowMoney(game, body, user);
        break;
      case GameModes.MULTP2P:
        console.log('mvp');
        await BorrowMoney.multiPlayerToPlayerBorrowMoney(game, body, user);
        break;
    }
    return game;
  }

  public async getBorrowedMoney(
    id: string,
    user: UserDoc,
    body: {
      portfolio: string;
      player: string;
    }
  ) {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError('Game is over or cancelled');
    }
    let totalAmount = 0;
    let index;
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        console.log('pvm');
        game.challengerProtfolios.forEach((portfolio) => {
          totalAmount += portfolio.borrowAmount;
        });
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        if (body.player === 'challenger') {
          console.log('pvp');
          game.challengerProtfolios.forEach((portfolio) => {
            totalAmount += portfolio.borrowAmount;
          });
        } else {
          game.rivalProtfolios.forEach((portfolio) => {
            totalAmount += portfolio.borrowAmount;
          });
        }
        break;
      case GameModes.MULTP2P:
        console.log('mvp');
        if (body.player == 'rival') {
          index = findPortfolio(
            game,
            body.portfolio,
            PortfolioSelect.RivalPortfolio
          );

          if (
            game.rivalProtfolios[index].user?.id.toString() !==
            user.id.toString()
          ) {
            throw new BadRequestError('Unable to get borrowed money');
          }
          totalAmount = game.rivalProtfolios[index].borrowAmount;
        } else {
          console.log('Challenger');
          index = findPortfolio(
            game,
            body.portfolio,
            PortfolioSelect.ChallengerPortfolio
          );
          if (
            game.challengerProtfolios[index].user?.id.toString() !==
            user.id.toString()
          ) {
            throw new BadRequestError('Unable to get borrowed money');
          }
          totalAmount = game.challengerProtfolios[index].borrowAmount;
        }
        break;
    }
    return totalAmount;
  }

  public async getRemainingAmount(
    id: string,
    user: UserDoc,
    body: {
      portfolio: string;
      player: string;
    }
  ) {
    const game = await this.get(id);
    if (
      game.status == GameStatus.Cancelled ||
      game.status === GameStatus.Over
    ) {
      throw new BadRequestError('Game is over or cancelled');
    }
    let totalAmount = 0;
    let remainingAmount = 0;
    let returnAmount = 0;
    let index;
    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        totalAmount = game.challengerProtfolios[0].borrowAmount;
        returnAmount = game.challengerProtfolios[0].returnAmount;
        remainingAmount = totalAmount - returnAmount;

        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        if (body.player === 'challenger') {
          console.log('pvp');
          game.challengerProtfolios.forEach((portfolio) => {
            totalAmount += portfolio.borrowAmount;
            returnAmount += portfolio.returnAmount;
          });
        } else {
          game.rivalProtfolios.forEach((portfolio) => {
            totalAmount += portfolio.borrowAmount;
            returnAmount += portfolio.returnAmount;
          });
        }
        remainingAmount = totalAmount - returnAmount;
        break;
      case GameModes.MULTP2P:
        if (body.player == 'rival') {
          index = findPortfolio(
            game,
            body.portfolio,
            PortfolioSelect.RivalPortfolio
          );

          if (
            game.rivalProtfolios[index].user?.id.toString() !==
            user.id.toString()
          ) {
            throw new BadRequestError('A012: Remaining borrowed money');
          }
          totalAmount = game.rivalProtfolios[index].borrowAmount;
          returnAmount = game.challengerProtfolios[index].returnAmount;
          remainingAmount = totalAmount - returnAmount;
        } else {
          index = findPortfolio(
            game,
            body.portfolio,
            PortfolioSelect.ChallengerPortfolio
          );

          if (
            game.challengerProtfolios[index].user?.id.toString() !==
            user.id.toString()
          ) {
            throw new BadRequestError('A013: Remaining borrowed money');
          }
          totalAmount = game.challengerProtfolios[index].borrowAmount;
          returnAmount = game.challengerProtfolios[index].returnAmount;
          remainingAmount = totalAmount - returnAmount;
        }
        break;
    }
    return remainingAmount;
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
  public async getGameStatus(club: string, leauge: string) {
    // Convert the club string to ObjectId
    const clubId = new mongoose.Types.ObjectId(club);

    console.log('Query Parameters:');
    console.log('club:', club);
    console.log('league:', leauge);

    // Find games based on gameMode and leauge
    const games = await Game.find({
      gameMode: '64f0683fb0985e73b9ecda81',
      leauge,
      status: 'Pending',
    });
    console.log('games:', games);

    // Filter games where either rivalClub or challengerClub matches clubId
    const filteredGames = games.filter((game) => {
      if (game.rivalClub && game.rivalClub.equals(clubId)) {
        return true;
      }
      if (game.challengerClub && game.challengerClub.equals(clubId)) {
        return true;
      }
      if (game.challenger === null && !game.rivalClub.equals(clubId)) {
        return true;
      }

      return false;
    });

    // Check if any filtered game has rivalPortfolio length less than 4
    const matchingGame = filteredGames.find((game) => {
      if (
        game.rivalClub &&
        game.rivalClub.equals(clubId) &&
        game.rivalProtfolios.length < 5
      ) {
        return true;
      }
      if (
        game.challengerClub &&
        game.challengerClub.equals(clubId) &&
        game.challengerProtfolios.length < 5
      ) {
        return true;
      }
      if (game.challenger === null && !game.rivalClub.equals(clubId)) {
        return true;
      }
      return false;
    });

    if (matchingGame) {
      // If a game matching the conditions was found
      console.log('matchingGame:', matchingGame);
      return matchingGame;
    } else {
      return {};
    }
  }

  public async leaveGame(
    gameId: string,
    player: string,
    userId: string
  ): Promise<GameDoc | null> {
    const game = await this.get(gameId);

    switch (game.gameMode.modeTitle) {
      case GameModes.IDLEP2M:
        game.deleteOne(game._id);
        return null;
        break;
      case GameModes.IDLEP2P:
      case GameModes.REALP2P:
        if (
          player === 'rival' &&
          // @ts-ignore
          userId.toString() === game.rival._id.toString()
        ) {
          if (game.challenger == null) {
            game.deleteOne(game._id);
            return null;
          } else {
            // @ts-ignore
            game.rival = null;
            game.rivalProtfolios = [];
            game.rivalBalance = 0;
            game.rivalGoals = 0;
            game.status = GameStatus.Over;
          }
        }

        if (
          player === 'challenger' &&
          userId.toString() === game.challenger?._id.toString()
        ) {
          if (game.rival == null) {
            game.deleteOne(game._id);
            return null;
            break;
          } else {
            // @ts-ignore
            game.challenger = null;
            game.challengerProtfolios = [];
            game.challengerBalance = 0;
            game.challengerGoals = 0;
            game.status = GameStatus.Over;
          }
        }
        break;
      case GameModes.MULTP2P:
        if (game.status === 'Pending') {
          if (player === 'rival') {
            // Remove the user from the game
            if (userId.toString() === game.rival?._id.toString()) {
              game.rival = null;
            }
            game.rivalProtfolios = game.rivalProtfolios.filter(
              // @ts-ignore
              (portfolio) =>
                portfolio.user?._id.toString() !== userId.toString()
            );
          }
          if (player === 'challenger') {
            // Remove the user from the game
            if (userId.toString() === game.challenger?._id.toString()) {
              game.challenger = null;
            }
            game.challengerProtfolios = game.challengerProtfolios.filter(
              // @ts-ignore
              (portfolio) =>
                portfolio.user?._id.toString() !== userId.toString()
            );
          }
          break;
        }
    }

    await game.save();

    return game;
  }

  public async quizAnswer(body: {
    gameId: string;
    quizId: string;
    answer: number;
    player: string;
  }) {
    const { gameId, quizId, answer, player } = body;
    const game = await this.get(gameId);
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new BadRequestError('Quiz question not found!');
    }

    console.log('Answer 11:', answer);

    if (
      answer === quiz.correctOption &&
      player === 'rival' &&
      game.isChallengerQuiz === true
    ) {
      game.isRivalQuiz = false;
      game.isChallengerQuiz = false;

      const goalKeeper = game.rivalProtfolios.findIndex(
        (e) => e.role === PlayerRoles.GK
      );

      if (game.rivalProtfolios.length === 0) return null;

      let maxIndex = 0;
      let maxValue = -Infinity;

      game.challengerProtfolios.forEach((portfolio, index) => {
        const value =
          portfolio.quantity * portfolio.portfolio.coin.quote.USD.price +
          portfolio.balance +
          portfolio.returnAmount -
          portfolio.borrowAmount;
        if (value > maxValue) {
          maxIndex = index;
          maxValue = value;
        }
      });
      console.log('Index with greatest value:', maxIndex);

      game.challengerProtfolios[maxIndex].ball = true;
      game.rivalProtfolios[goalKeeper].ball = false;
      game.rivalGoals += 1;

      await game.save();
    } else if (
      answer === quiz.correctOption &&
      player === 'challenger' &&
      game.isRivalQuiz === true
    ) {
      game.isChallengerQuiz = false;
      game.isRivalQuiz = false;

      const goalKeeper = game.challengerProtfolios.findIndex(
        (e) => e.role === PlayerRoles.GK
      );
      if (game.challengerProtfolios.length === 0) return null;

      let maxIndex = 0;
      let maxValue = -Infinity;

      game.rivalProtfolios.forEach((portfolio, index) => {
        const value =
          portfolio.quantity * portfolio.portfolio.coin.quote.USD.price +
          portfolio.balance +
          portfolio.returnAmount -
          portfolio.borrowAmount;
        if (value > maxValue) {
          maxIndex = index;
          maxValue = value;
        }
      });
      console.log('E102: Index with greatest value:', maxIndex);

      game.rivalProtfolios[maxIndex].ball = true;
      game.challengerProtfolios[goalKeeper].ball = false;

      game.challengerGoals += 1;
      await game.save();
    } else if (
      answer != quiz.correctOption &&
      player === 'rival' &&
      game.isChallengerQuiz === true
    ) {
      game.isChallengerQuiz = false;
      game.isRivalQuiz = false;

      const goalKeeper = game.rivalProtfolios.findIndex(
        (e) => e.role === PlayerRoles.GK
      );

      const filteredRival = game.rivalProtfolios.filter(
        (e) => e.role !== PlayerRoles.GK
      );
      const filteredChallenger = game.challengerProtfolios.filter(
        (e) => e.role !== PlayerRoles.GK
      );
      const remaingPlayer = [...filteredChallenger, ...filteredRival];
      const passesToIndex = Math.floor(Math.random() * remaingPlayer.length);

      remaingPlayer[passesToIndex].ball = true;
      game.rivalProtfolios[goalKeeper].ball = false;
      await game.save();
      throw new BadRequestError('Question answer is wrong, no goal awarded.');
    } else if (
      answer != quiz.correctOption &&
      player === 'challenger' &&
      game.isRivalQuiz === true
    ) {
      game.isChallengerQuiz = false;
      game.isRivalQuiz = false;

      const goalKeeper = game.challengerProtfolios.findIndex(
        (e) => e.role === PlayerRoles.GK
      );

      const filteredRival = game.rivalProtfolios.filter(
        (e) => e.role !== PlayerRoles.GK
      );
      const filteredChallenger = game.challengerProtfolios.filter(
        (e) => e.role !== PlayerRoles.GK
      );
      const remaingPlayer = [...filteredChallenger, ...filteredRival];
      const passesToIndex = Math.floor(Math.random() * remaingPlayer.length);

      remaingPlayer[passesToIndex].ball = true;
      game.challengerProtfolios[goalKeeper].ball = false;
      await game.save();
      throw new BadRequestError('Question answer is wrong, no goal awarded.');
    } else if (game.isRivalQuiz === true && game.isChallengerQuiz === true) {
      throw new BadRequestError('Question is expired.');
    }

    return game;
  }
}

export default new Service();
