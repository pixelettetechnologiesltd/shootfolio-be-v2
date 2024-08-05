import mongoose from 'mongoose';
import { BadRequestError } from '../../../errors/badRequest.error';
import CryptoCoins from '../../CryptoCoins/entity/model';
import GameLeague from '../../GameLeagues/entity/model';
import { GameModeDoc } from '../../GameModes/entity/interface';
import Portfolio from '../../Portfolio/entity/model';
import { UserDoc } from '../../User/entity/user.interface';
import { GameAttrs, GameDoc, GameModes, GameStatus } from '../entity/interface';
import ClubService from '../../GameClubs/Service';
import PortfolioService from '../../Portfolio/Service';
import { PlayerType } from '../../Portfolio/entity/interface';
import Game from '../entity/model';
import { idelPlayerToMachineGameScheduler } from '../../../bull/idleP2m';
import User from '../../User/entity/User.model';
import Admin from '../../Admin/entity/Admin.model';
import GameMode from '../../GameModes/entity/model';
import { scheduleGameOver } from './utils/scheduleGameOver';
import { scheduleGameComparison } from './utils/comparisonProcessor';

export const idlePlayerToMachineGame = async (
  body: GameAttrs,
  user: UserDoc,
  gameMode: GameModeDoc
): Promise<GameDoc> => {
  const obj = {};
  for (let i = 0; i < body.portfolios.length; i++) {
    if (body.portfolios[i].toString() in obj) {
      throw new BadRequestError('duplicate coins, please use different coins');
    }
  }
  // check if balance matches
  const portfolios = await Portfolio.find({ club: body.rivalClub, playerType: "Bot" }).limit(5);

  if (!portfolios.length) {
    throw new BadRequestError('No Machine portfolios found');
  }
  let totalBalance = 0;
  for (let i = 0; i < body.portfolios.length; i++) {
    const coin = await CryptoCoins.findById(body.portfolios[i].portfolio);
    if (!coin) {
      throw new BadRequestError('Asset not found');
    }
    totalBalance += body.portfolios[i].quantity * coin.quote.USD.price;
  }
  const leauge = await GameLeague.findById(body.leauge);
  if (!leauge) {
    throw new BadRequestError('Leauge not found');
  }

  if (totalBalance > leauge.investableBudget) {
    throw new BadRequestError('Your balance is not enough');
  }
  // find rival portfolios
  const rivalClub = await ClubService.get(body?.rivalClub!.toString());

  console.log(portfolios);

  let rival;
  const rivalPortfolios: {
    portfolio: mongoose.Types.ObjectId;
    quantity: number;
  }[] = portfolios.map((doc, index) => {
    if (index == 0) rival = doc.admin.id;
    return {
      portfolio: doc._id,
      quantity: doc.quantity,
    };
  });

  // create portfolios
  const challengerProtfolios: {
    portfolio: mongoose.Types.ObjectId;
    quantity: number;
  }[] = [];
  for (let i = 0; i < body.portfolios.length; i++) {
    const portfolio = await PortfolioService.create({
      user: user.id,
      coin: body.portfolios[i].portfolio,
      admin: null,
      // @ts-ignore
      club: body.challengerClub,
      playerType: PlayerType.Real,
      quantity: body.portfolios[i].quantity,
    });
    await portfolio.save();
    challengerProtfolios.push({
      portfolio: portfolio.id,
      quantity: portfolio.quantity,
    });
  }
  const game = await Game.create({
    rival: rival,
    challenger: user.id,
    rivalClub: body.rivalClub,
    challengerClub: body.challengerClub,
    rivalProtfolios: rivalPortfolios,
    challengerProtfolios: challengerProtfolios,
    rivalBalance: 0,
    challengerBalance: leauge.investableBudget - totalBalance,
    gameMode: body.gameMode,
    leauge: body.leauge,
    type: 'days',
    remainingCamparisons: 7,
    status: GameStatus.Play,
  });
  const Gamemode = await GameMode.findById(game.gameMode);
  //S221
  if (Gamemode) {
    const duration = 7 * 24 * 60 * 60 * 1000;
    await scheduleGameOver(game._id, duration);
    await scheduleGameComparison(game._id, Gamemode.duration);
  }

  idelPlayerToMachineGameScheduler(game.id);
  await Game.populate(game, { path: 'rivalProtfolios.portfolio' });
  await Game.populate(game, { path: 'challengerProtfolios.portfolio' });
  // await Game.populate(game, { path: "rival" });
  await Game.populate(game, { path: 'challenger' });
  let x;
  x = await Admin.findById(game.rival);
  // @ts-ignore
  game.rival = user;
  return game.save();
};
