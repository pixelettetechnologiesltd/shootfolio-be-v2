import mongoose from "mongoose";
import { BadRequestError } from "../../../errors/badRequest.error";
import CryptoCoins from "../../CryptoCoins/entity/model";
import GameLeague from "../../GameLeagues/entity/model";
import { GameModeDoc } from "../../GameModes/entity/interface";
import { UserDoc } from "../../User/entity/user.interface";
import { GameAttrs, GameStatus, PlayerRoles } from "../entity/interface";
import PortfolioService from "../../Portfolio/Service";
import { PlayerType } from "../../Portfolio/entity/interface";
import Game from "../entity/model";
import User from "../../User/entity/User.model";
import Admin from "../../Admin/entity/Admin.model";
import { multiPlayerToPlayerGameScheduler } from "../../../bull/multiP2p";

export const multiPlayerToPlayerGame = async (
  body: GameAttrs,
  user: UserDoc,
  gameMode: GameModeDoc
) => {
  if (body.portfolios.length !== 1) {
    throw new BadRequestError("Select only one asset");
  }
  const leauge = await GameLeague.findById(body.leauge);
  if (!leauge) {
    throw new BadRequestError("Leauge not found");
  }
  if (body.gameId) {
    let decider;

    const game = await Game.findById(body.gameId);
    if (!game) {
      throw new BadRequestError("No game found!");
    }
    if (game.status === GameStatus.Over) {
      throw new BadRequestError("This game is over");
    }

    if (game.rivalClub.toString() === body.club.toString()) {
      decider = "rival";
    } else {
      decider = "challenger";
    }
    if (decider === "challenger") {
      if (game.challengerProtfolios.length === 5) {
        throw new BadRequestError("Team is already full");
      }
      if (
        game.challengerProtfolios.some(
          (e) =>
            e.portfolio.coin._id.toString() ===
            body.portfolios[0].portfolio.toString()
        )
      ) {
        throw new BadRequestError(
          "Asset already taken, please select a different one!"
        );
      }

      if (
        game.challengerProtfolios.some(
          (e) => e.role === body.portfolios[0].role
        )
      ) {
        throw new BadRequestError("This role has been taken!");
      }

      const coin = await CryptoCoins.findById(body.portfolios[0].portfolio);
      if (!coin) throw new BadRequestError("Asset not found");

      if (
        coin.quote.USD.price * body.portfolios[0].quantity >
        // @ts-ignore
        leauge.investableBudget / 5
      ) {
        throw new BadRequestError("Your balance is insufficient");
      }

      const portfolio = await PortfolioService.create({
        user: user.id,
        coin: coin._id,
        // @ts-ignore
        club: body.rivalClub ? body.rivalClub : body.challengerClub,
        playerType: PlayerType.Real,
        quantity: body.portfolios[0].quantity,
      });
      // @ts-ignore
      game.challengerProtfolios.push({
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
        user: user.id,
        balance:
          // @ts-ignore
          leauge.investableBudget / 5 -
          coin.quote.USD.price * portfolio.quantity,
        role: body.portfolios[0].role,
        ball: false,
      });
      if (!game.challenger) game.challenger = user.id;
      // @ts-ignore
      if (!game.challengerClub) game.challengerClub = body.challengerClub;
    } else {
      if (game.rivalProtfolios.length === 5) {
        throw new BadRequestError("Team is already full");
      }
      if (
        game.rivalProtfolios.some(
          (e) =>
            e.portfolio.coin._id.toString() ===
            body.portfolios[0].portfolio.toString()
        )
      ) {
        throw new BadRequestError(
          "Asset already taken, please select a different one!"
        );
      }

      if (
        game.rivalProtfolios.some((e) => e.role === body.portfolios[0].role)
      ) {
        throw new BadRequestError("This role has been taken!");
      }

      const coin = await CryptoCoins.findById(body.portfolios[0].portfolio);
      if (!coin) throw new BadRequestError("Asset not found");

      if (
        coin.quote.USD.price * body.portfolios[0].quantity >
        // @ts-ignore
        leauge.investableBudget / 5
      ) {
        throw new BadRequestError("Your balance is insufficient");
      }

      const portfolio = await PortfolioService.create({
        user: user.id,
        coin: coin._id,
        // @ts-ignore
        club: body.rivalClub ? body.rivalClub : body.challengerClub,
        playerType: PlayerType.Real,
        quantity: body.portfolios[0].quantity,
      });
      // @ts-ignore
      game.rivalProtfolios.push({
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
        user: user.id,
        balance:
          // @ts-ignore
          leauge.investableBudget / 5 -
          coin.quote.USD.price * portfolio.quantity,
        role: body.portfolios[0].role,
        ball: false,
      });
      if (!game.challenger) game.challenger = user.id;
      // @ts-ignore
      if (!game.challengerClub) game.challengerClub = body.club;
    }

    await Game.populate(game, { path: "challengerProtfolios.portfolio" });
    await Game.populate(game, { path: "challengerProtfolios.portfolio.user" });
    await Game.populate(game, { path: "rivalProtfolios.portfolio" });
    await Game.populate(game, { path: "rivalProtfolios.portfolio.user" });
    // await Game.populate(game, { path: "rival" });
    let populateRival;
    populateRival = await User.findById(game.rival);
    if (populateRival) {
      // @ts-ignore
      game.rival = populateRival;
    }
    await Game.populate(game, { path: "challenger" });
    // realTimePlayerToPlayerGameScheduler(game.id);
    if (
      game.rivalProtfolios.length === 5 &&
      game.challengerProtfolios.length === 5
    ) {
      // Lets start the fucking game
      // @ts-ignore
      let challengerBalance = game.challengerProtfolios.reduce(
        (acc, curr) => acc + leauge.investableBudget / 5 - curr.balance,
        0
      );
      let rivalBalance = game.rivalProtfolios.reduce(
        (acc, curr) => acc + leauge.investableBudget / 5 - curr.balance,
        0
      );
      game.challengerBalance = challengerBalance;
      game.rivalBalance = rivalBalance;

      game.status = GameStatus.Play;
      if (challengerBalance > rivalBalance) {
        const index = game.challengerProtfolios.findIndex(
          (e) => e.role !== PlayerRoles.GK
        );
        game.challengerProtfolios[index].ball = true;
      } else {
        const index = game.rivalProtfolios.findIndex(
          (e) => e.role !== PlayerRoles.GK
        );
        game.rivalProtfolios[index].ball = true;
      }
      multiPlayerToPlayerGameScheduler(game.id);
    }
    return await game.save();
  } else {
    const coin = await CryptoCoins.findById(body.portfolios[0].portfolio);
    if (!coin) throw new BadRequestError("Asset not found");
    if (
      coin.quote.USD.price * body.portfolios[0].quantity >
      leauge.investableBudget / 5
    ) {
      throw new BadRequestError("Your balance is insufficient");
    }
    const portfolio = await PortfolioService.create({
      user: user.id,
      coin: coin._id,
      // @ts-ignore
      club: body.rivalClub ? body.rivalClub : body.challengerClub,
      playerType: PlayerType.Real,
      quantity: body.portfolios[0].quantity,
    });
    // create portfolios
    const rivalPortfolios: {
      portfolio: mongoose.Types.ObjectId;
      quantity: number;
      user: mongoose.Types.ObjectId;
      balance: number;
      role: string;
    }[] = [
      {
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
        user: user.id,
        balance:
          leauge.investableBudget / 5 -
          coin.quote.USD.price * portfolio.quantity,
        role: body.portfolios[0].role,
      },
    ];

    const game = await Game.create({
      rival: user.id,
      challenger: null,
      rivalClub: body.club,
      challengerClub: null,
      rivalProtfolios: rivalPortfolios,
      challengerProtfolios: [],
      rivalBalance: 0,
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
    await Game.populate(game, { path: "rivalProtfolios.user" });
    return game.save();
  }
};
