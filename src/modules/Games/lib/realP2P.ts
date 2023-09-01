import mongoose from "mongoose";
import { BadRequestError } from "../../../errors/badRequest.error";
import CryptoCoins from "../../CryptoCoins/entity/model";
import GameLeague from "../../GameLeagues/entity/model";
import { GameModeDoc } from "../../GameModes/entity/interface";
import { UserDoc } from "../../User/entity/user.interface";
import { GameAttrs, GameStatus } from "../entity/interface";
import PortfolioService from "../../Portfolio/Service";
import { PlayerType } from "../../Portfolio/entity/interface";
import Game from "../entity/model";
import { realTimePlayerToPlayerGameScheduler } from "../../../bull/RealP2p";
import User from "../../User/entity/User.model";
import Admin from "../../Admin/entity/Admin.model";

export const realPlayerToPlayerGame = async (
  body: GameAttrs,
  user: UserDoc,
  gameMode: GameModeDoc
) => {
  const obj = {};
  for (let i = 0; i < body.portfolios.length; i++) {
    if (body.portfolios[i].toString() in obj) {
      throw new BadRequestError(
        "Duplicate assets, please use different assets"
      );
    }
  }
  if (body.gameId) {
    const game = await Game.findById(body.gameId);
    if (!game) {
      throw new BadRequestError("No game found!");
    }
    // @ts-ignore
    if (game.rivalClub.toString() === body.challengerClub) {
      throw new BadRequestError("You can not compete with same club!");
    }

    let totalBalance = 0;
    for (let i = 0; i < body.portfolios.length; i++) {
      const coin = await CryptoCoins.findById(body.portfolios[i].portfolio);
      if (!coin) {
        throw new BadRequestError("Asset not found");
      }
      totalBalance += body.portfolios[i].quantity * coin.quote.USD.price;
    }
    const leauge = await GameLeague.findById(body.leauge);
    if (!leauge) {
      throw new BadRequestError("Leauge not found");
    }

    if (totalBalance > leauge.investableBudget) {
      throw new BadRequestError("Your balance is not enough");
    }

    // create portfolios
    const challengerPortfolios: {
      portfolio: mongoose.Types.ObjectId;
      quantity: number;
    }[] = [];
    for (let i = 0; i < body.portfolios.length; i++) {
      const portfolio = await PortfolioService.create({
        user: user.id,
        coin: body.portfolios[i].portfolio,
        admin: null,
        // @ts-ignore
        club: body.rivalClub,
        playerType: PlayerType.Real,
        quantity: body.portfolios[i].quantity,
      });
      await portfolio.save();
      challengerPortfolios.push({
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
      });
    }
    console.log(challengerPortfolios);

    game.challengerBalance = leauge.investableBudget - totalBalance;
    game.challenger = user.id;
    // @ts-ignore
    game.challengerProtfolios = challengerPortfolios;
    // @ts-ignore
    game.challengerClub = body.challengerClub;
    game.status = GameStatus.Play;
    await Game.populate(game, { path: "challengerProtfolios.portfolio" });
    // await Game.populate(game, { path: "rival" });
    let populateRival;
    populateRival = await User.findById(game.rival);
    if (populateRival) {
      // @ts-ignore
      game.rival = populateRival;
    } else {
      populateRival = await Admin.findById(game.rival);
      // @ts-ignore
      game.rival = populateRival;
    }
    await Game.populate(game, { path: "challenger" });
    realTimePlayerToPlayerGameScheduler(game.id);
    return await game.save();
  } else {
    let totalBalance = 0;
    for (let i = 0; i < body.portfolios.length; i++) {
      const coin = await CryptoCoins.findById(body.portfolios[i].portfolio);
      if (!coin) {
        throw new BadRequestError("Asset not found");
      }
      totalBalance += body.portfolios[i].quantity * coin.quote.USD.price;
    }
    const leauge = await GameLeague.findById(body.leauge);
    if (!leauge) {
      throw new BadRequestError("Leauge not found");
    }

    if (totalBalance > leauge.investableBudget) {
      throw new BadRequestError("Your balance is not enough");
    }

    // create portfolios
    const rivalPortfolios: {
      portfolio: mongoose.Types.ObjectId;
      quantity: number;
    }[] = [];
    for (let i = 0; i < body.portfolios.length; i++) {
      const portfolio = await PortfolioService.create({
        user: user.id,
        coin: body.portfolios[i].portfolio,
        admin: null,
        // @ts-ignore
        club: body.rivalClub,
        playerType: PlayerType.Real,
        quantity: body.portfolios[i].quantity,
      });
      await portfolio.save();
      rivalPortfolios.push({
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
      });
    }
    const game = await Game.create({
      rival: user.id,
      challenger: null,
      rivalClub: body.rivalClub,
      challengerClub: null,
      rivalProtfolios: rivalPortfolios,
      challengerProtfolios: [],
      rivalBalance: leauge.investableBudget - totalBalance,
      challengerBalance: null,
      gameMode: body.gameMode,
      leauge: body.leauge,
      type: "minutes",
      remainingCamparisons: 18,
      status: GameStatus.Pending,
    });
    // await Game.populate(game, { path: "rival" });
    let populateRival;
    populateRival = await User.findById(game.rival);
    if (populateRival) {
      // @ts-ignore
      game.rival = populateRival;
    } else {
      populateRival = await Admin.findById(game.rival);
      // @ts-ignore
      game.rival = populateRival;
    }
    await Game.populate(game, { path: "challenger" });
    return game.save();
  }
};
