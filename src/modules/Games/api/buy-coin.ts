import { BadRequestError } from "../../../errors/badRequest.error";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, PortfolioSelect } from "../entity/interface";
import { findPortfolio } from "../lib/utils";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";

class BuyCoin {
  public async multiPlayerToPlayerBuyCoin(
    game: GameDoc,
    body: {
      portfolio: string;
      quantity: number;
      player: string;
    },
    user: UserDoc
  ) {
    if (body.player == "rival") {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.RivalPortfolio
      );

      if (
        game.rivalProtfolios[index].user?.id.toString() !== user.id.toString()
      ) {
        throw new BadRequestError("Unable to buy coin");
      }
      let cost =
        game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      if (cost > game.rivalProtfolios[index].balance) {
        throw new BadRequestError(
          "You don't have enough balance to buy more assets"
        );
      }
      game.rivalProtfolios[index].balance -= cost;
      game.rivalProtfolios[index].quantity += body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Rival,
        text: `${user.name} has bought ${body.quantity} ${game.rivalProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    } else {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.ChallengerPortfolio
      );
      if (
        game.challengerProtfolios[index].user?.id.toString() !==
        user.id.toString()
      ) {
        throw new BadRequestError("Unable to buy coin");
      }
      let cost =
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      if (cost > game.challengerProtfolios[index].balance) {
        throw new BadRequestError(
          "You don't have enough balance to buy more assets"
        );
      }
      game.challengerProtfolios[index].balance -= cost;
      game.challengerProtfolios[index].quantity += body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    }
    await game.save();
  }

  public async idlePlayerToMachineBuy(
    game: GameDoc,
    body: { portfolio: string; quantity: number },
    user: UserDoc
  ) {
    const index = findPortfolio(
      game,
      body.portfolio,
      PortfolioSelect.ChallengerPortfolio
    );
    let cost =
      body.quantity *
      game.challengerProtfolios[index].portfolio.coin.quote.USD.price;
    if (cost > game.challengerBalance) {
      throw new BadRequestError(
        "You don't have enough balance to buy more assets"
      );
    }

    game.challengerProtfolios[index].quantity += body.quantity;
    game.challengerBalance -= cost;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
    });
    await game.save();
  }

  public async idlePlayerToPlayerBuy(
    game: GameDoc,
    body: { portfolio: string; quantity: number },
    user: UserDoc
  ) {
    if (game.challenger.id.toString() === user.id.toString()) {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.ChallengerPortfolio
      );
      let cost =
        body.quantity *
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price;
      if (cost > game.challengerBalance) {
        throw new BadRequestError(
          "You don't have enough balance to buy more assets"
        );
      }
      game.challengerProtfolios[index].quantity += body.quantity;
      game.challengerBalance -= cost;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    } else {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.RivalPortfolio
      );
      let cost =
        body.quantity *
        game.rivalProtfolios[index].portfolio.coin.quote.USD.price;
      if (cost > game.challengerBalance) {
        throw new BadRequestError(
          "You don't have enough balance to buy more assets"
        );
      }
      game.rivalProtfolios[index].quantity += body.quantity;
      game.rivalBalance -= cost;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Rival,
        text: `${user.name} has bought ${body.quantity} ${game.rivalProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    }

    await game.save();
  }
}

export default new BuyCoin();
