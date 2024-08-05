import { BadRequestError } from "../../../errors/badRequest.error";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, PortfolioSelect } from "../entity/interface";
import { calculatePortfolio, findPortfolio } from "../lib/utils";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";
class SellCoin {
  public async multiPlayerToPlayerSellCoin(
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
      if (game.rivalProtfolios[index].quantity < body.quantity) {
        throw new BadRequestError(
          "You dont have enough assets to sell for this potfolio"
        );
      }
      if (
        game.rivalProtfolios[index].user?.id.toString() !== user.id.toString()
      ) {
        throw new BadRequestError("You cannot sell other player assets");
      }
      // calculatePortfolio(game);
      let cost =
        game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      
      game.rivalProtfolios[index].balance += cost;
      game.rivalProtfolios[index].quantity -= body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Rival,
        text: `${user.name} has sell ${body.quantity} of ${game.rivalProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    } else {
      console.log("A0989", body.portfolio);
      console.log("A0989", body.player);
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.ChallengerPortfolio
      );
      if (game.challengerProtfolios[index].quantity < body.quantity) {
        throw new BadRequestError(
          "You dont have enough assets to sell for this potfolio"
        );
      }
      if (
        game.challengerProtfolios[index].user?.id.toString() !==
        user.id.toString()
      ) {
        throw new BadRequestError("You cannot sell other player assets");
      }
      // calculatePortfolio(game);
      let cost =
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
        console.log("A0989", cost);
      game.challengerProtfolios[index].balance += cost;
      game.challengerProtfolios[index].quantity -= body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
    }
    await game.save();
  }

  public async idlePlayerToPlayerSell(
    game: GameDoc,
    body: { portfolio: string; quantity: number },
    user: UserDoc
  ) {
    if (game.challenger?.id.toString() === user.id.toString()) {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.ChallengerPortfolio
      );

      if (game.challengerProtfolios[index].quantity < body.quantity) {
        throw new BadRequestError(
          "You dont have enough assets to sell for this potfolio"
        );
      }
      // calculatePortfolio(game);
      game.challengerBalance +=
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      game.challengerProtfolios[index].quantity -= body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin.name} worth ${game.challengerProtfolios[index].portfolio.coin.quote.USD.price}`,
      });
    } else {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.RivalPortfolio
      );

      if (game.rivalProtfolios[index].quantity < body.quantity) {
        throw new BadRequestError(
          "You dont have enough assets to sell for this potfolio"
        );
      }
      // calculatePortfolio(game);
      game.rivalBalance +=
        game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      game.rivalProtfolios[index].quantity -= body.quantity;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Rival,
        text: `${user.name} has sell ${body.quantity} of ${game.rivalProtfolios[index].portfolio.coin.name} worth ${game.rivalProtfolios[index].portfolio.coin.quote.USD.price}`,
      });
    }

    await game.save();
  }

  public async idlePlayerToMachineSell(
    game: GameDoc,
    body: { portfolio: string; quantity: number },
    user: UserDoc
  ) {
    const index = findPortfolio(
      game,
      body.portfolio,
      PortfolioSelect.ChallengerPortfolio
    );
    if (game.challengerProtfolios[index].quantity < body.quantity) {
      throw new BadRequestError(
        "You dont have enough assets to sell for this potfolio"
      );
    }

    // calculatePortfolio(game);

    game.challengerBalance +=
      game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
      body.quantity;
    game.challengerProtfolios[index].quantity -= body.quantity;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin.name} worth ${game.challengerProtfolios[index].portfolio.coin.quote.USD.price}`,
    });
    await game.save();
  }
}

export default new SellCoin();
