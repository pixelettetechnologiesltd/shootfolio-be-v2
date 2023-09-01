import { BadRequestError } from "../../../errors/badRequest.error";
import CryptoCoins from "../../CryptoCoins/entity/model";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, PortfolioSelect } from "../entity/interface";
import { findPortfolio, calculatePortfolio } from "../lib/utils";
import PortfolioService from "../../Portfolio/Service";
import { PlayerType } from "../../Portfolio/entity/interface";
import Game from "../entity/model";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";
class ChangeCoin {
  public async idlePlayerToMachineChangeCoin(
    game: GameDoc,
    body: { currentPortfolio: string; newPortfolio: string; quantity: number },
    user: UserDoc
  ) {
    if (
      game.challengerProtfolios.some(
        (e) => e.portfolio.coin._id.toString() === body.newPortfolio
      )
    ) {
      throw new BadRequestError(
        "Portfolio already exists, select a different asset"
      );
    }
    const coin = await CryptoCoins.findById(body.newPortfolio);
    if (!coin) {
      throw new BadRequestError("No coin found!");
    }

    const index = findPortfolio(
      game,
      body.currentPortfolio,
      PortfolioSelect.ChallengerPortfolio
    );
    let previous = game.challengerProtfolios[index];
    game.challengerBalance +=
      previous.portfolio.coin.quote.USD.price * previous.quantity;
    if (game.challengerBalance < coin.quote.USD.price * body.quantity) {
      throw new BadRequestError("You balance is not enough!");
    }

    const newPortfolio = await PortfolioService.create({
      user: user.id,
      coin: coin._id,
      admin: null,
      // @ts-ignore
      club: game.challengerClub,
      playerType: PlayerType.Real,
      quantity: body.quantity,
    });
    game.challengerBalance -= coin.quote.USD.price * body.quantity;
    game.challengerProtfolios[index] = {
      portfolio: newPortfolio.id,
      quantity: body.quantity,
      user: null,
      ball: false,
      balance: 0,
      role: null,
      borrowAmount: previous.borrowAmount,
    };
    await Game.populate(game, { path: "challengerProtfolios.portfolio" });
    calculatePortfolio(game);
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
    });
    await game.save();
  }

  public async idlePlayerToPlayerChangeCoin(
    game: GameDoc,
    body: { currentPortfolio: string; newPortfolio: string; quantity: number },
    user: UserDoc
  ) {
    if (
      game.challengerProtfolios.some(
        (e) => e.portfolio.coin._id.toString() === body.newPortfolio
      )
    ) {
      throw new BadRequestError(
        "Portfolio already exists, select a different asset"
      );
    }
    const coin = await CryptoCoins.findById(body.newPortfolio);
    if (!coin) {
      throw new BadRequestError("No coin found!");
    }
    const index = findPortfolio(
      game,
      body.currentPortfolio,
      PortfolioSelect.ChallengerPortfolio
    );
    let previous = game.challengerProtfolios[index];
    game.challengerBalance -= coin.quote.USD.price * body.quantity;
    if (game.challenger.id.toString() === user.id.toString()) {
      if (game.challengerBalance < coin.quote.USD.price * body.quantity) {
        throw new BadRequestError("You balance is not enough!");
      }

      const newPortfolio = await PortfolioService.create({
        user: user.id,
        coin: coin._id,
        admin: null,
        // @ts-ignore
        club: game.challengerClub,
        playerType: PlayerType.Real,
        quantity: body.quantity,
      });
      game.challengerBalance +=
        previous.portfolio.coin.quote.USD.price * previous.quantity;

      game.challengerProtfolios[index] = {
        portfolio: newPortfolio.id,
        quantity: body.quantity,
        user: null,
        ball: false,
        balance: 0,
        role: null,
        borrowAmount: previous.borrowAmount,
      };
      await Game.populate(game, { path: "challengerProtfolios.portfolio" });
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
      });
      calculatePortfolio(game);
    } else {
      if (
        game.rivalProtfolios.some(
          (e) => e.portfolio.coin._id.toString() === body.newPortfolio
        )
      ) {
        throw new BadRequestError(
          "Portfolio already exists, select a different asset"
        );
      }
      const index = findPortfolio(
        game,
        body.currentPortfolio,
        PortfolioSelect.RivalPortfolio
      );
      let previous = game.rivalProtfolios[index];
      game.challengerBalance -= coin.quote.USD.price * body.quantity;
      if (game.rivalBalance < coin.quote.USD.price * body.quantity) {
        throw new BadRequestError("You balance is not enough!");
      }

      const newPortfolio = await PortfolioService.create({
        user: user.id,
        coin: coin._id,
        admin: null,
        // @ts-ignore
        club: game.challengerClub,
        playerType: PlayerType.Real,
        quantity: body.quantity,
      });
      game.challengerBalance +=
        previous.portfolio.coin.quote.USD.price * previous.quantity;
      game.rivalProtfolios[index] = {
        portfolio: newPortfolio.id,
        quantity: body.quantity,
        user: null,
        ball: false,
        balance: 0,
        role: null,
        borrowAmount: previous.borrowAmount,
      };
      await Game.populate(game, { path: "rivalProtfolios.portfolio" });

      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Rival,
        text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.rivalProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
      });
      calculatePortfolio(game);
    }
    await game.save();
  }
  public async multiPlayerToPlayerChangeCoin(
    game: GameDoc,
    body: {
      currentPortfolio: string;
      newPortfolio: string;
      quantity: number;
      player: string;
    },
    user: UserDoc
  ) {
    if (body.player == "rival") {
      if (
        game.rivalProtfolios.some(
          (e) => e.portfolio.coin._id.toString() === body.newPortfolio
        )
      ) {
        throw new BadRequestError(
          "Portfolio already exists, select a different asset"
        );
      }
      const coin = await CryptoCoins.findById(body.newPortfolio);
      if (!coin) {
        throw new BadRequestError("No coin found!");
      }
      const index = findPortfolio(
        game,
        body.currentPortfolio,
        PortfolioSelect.RivalPortfolio
      );
      let previous = game.rivalProtfolios[index];
      game.rivalBalance -= coin.quote.USD.price * body.quantity;
      // @ts-ignore
      if (previous.user.id.toString() === user.id.toString()) {
        if (
          coin.quote.USD.price * previous.quantity >
          game.leauge.investableBudget / 5
        ) {
          throw new BadRequestError("You balance is not enough!");
        }
        const newPortfolio = await PortfolioService.create({
          user: user.id,
          coin: coin._id,
          admin: null,
          club: game.rivalClub,
          playerType: PlayerType.Real,
          quantity: body.quantity,
        });
        game.rivalBalance += coin.quote.USD.price * previous.quantity;

        game.rivalProtfolios[index] = {
          portfolio: newPortfolio.id,
          quantity: body.quantity,
          user: user.id,
          ball: previous.ball,
          balance:
            game.leauge.investableBudget / 5 -
            coin.quote.USD.price * body.quantity,
          role: previous.role,
          borrowAmount: previous.borrowAmount,
        };
        await Game.populate(game, { path: "rivalProtfolios.portfolio" });
        await Game.populate(game, { path: "rivalProtfolios.portfolio.user" });

        GameHistoryService.create({
          game: game.id,
          user: user.id,
          player: PlayerTeam.Rival,
          text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.rivalProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
        });
        calculatePortfolio(game);
      } else {
        throw new BadRequestError("You cannot change other portfolios");
      }
    } else {
      if (
        game.challengerProtfolios.some(
          (e) => e.portfolio.coin._id.toString() === body.newPortfolio
        )
      ) {
        throw new BadRequestError(
          "Portfolio already exists, select a different asset"
        );
      }
      const coin = await CryptoCoins.findById(body.newPortfolio);
      if (!coin) {
        throw new BadRequestError("No coin found!");
      }
      const index = findPortfolio(
        game,
        body.currentPortfolio,
        PortfolioSelect.ChallengerPortfolio
      );
      let previous = game.challengerProtfolios[index];
      game.challengerBalance -= coin.quote.USD.price * body.quantity;
      // @ts-ignore
      if (previous.user.id.toString() === user.id.toString()) {
        if (
          coin.quote.USD.price * previous.quantity >
          game.leauge.investableBudget / 5
        ) {
          throw new BadRequestError("You balance is not enough!");
        }
        const newPortfolio = await PortfolioService.create({
          user: user.id,
          coin: coin._id,
          admin: null,
          club: game.challengerClub,
          playerType: PlayerType.Real,
          quantity: body.quantity,
        });
        game.challengerBalance += coin.quote.USD.price * previous.quantity;

        game.challengerProtfolios[index] = {
          portfolio: newPortfolio.id,
          quantity: body.quantity,
          user: user.id,
          ball: previous.ball,
          balance:
            game.leauge.investableBudget / 5 -
            coin.quote.USD.price * body.quantity,
          role: previous.role,
          borrowAmount: previous.borrowAmount,
        };
        await Game.populate(game, { path: "challengerProtfolios.portfolio" });
        await Game.populate(game, {
          path: "challengerProtfolios.portfolio.user",
        });

        GameHistoryService.create({
          game: game.id,
          user: user.id,
          player: PlayerTeam.Challenger,
          text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
        });
        calculatePortfolio(game);
      } else {
        throw new BadRequestError("You cannot change other portfolios");
      }
    }
    await game.save();
  }
}

export default new ChangeCoin();
