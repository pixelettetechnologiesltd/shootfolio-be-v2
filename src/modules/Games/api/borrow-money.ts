import { BadRequestError } from "../../../errors/badRequest.error";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, PortfolioSelect } from "../entity/interface";
import { findPortfolio } from "../lib/utils";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";

class BorrowMoney {
  public async multiPlayerToPlayerBorrowMoney(
    game: GameDoc,
    body: {
      portfolio: string;
      amount: number;
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
        throw new BadRequestError("Unable to borrow money");
      }
      const totalAmount =
        game.rivalProtfolios[index].borrowAmount + body.amount;
      if (totalAmount > game.leauge.borrowAmount) {
        throw new BadRequestError("Borrow amount limit reached");
      }
      game.rivalProtfolios[index].borrowAmount += body.amount;
      game.rivalProtfolios[index].balance += body.amount;
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
      const totalAmount =
        game.challengerProtfolios[index].borrowAmount + body.amount;
      if (totalAmount > game.leauge.borrowAmount) {
        throw new BadRequestError("Borrow amount limit reached");
      }
      game.challengerProtfolios[index].borrowAmount += body.amount;
      game.challengerProtfolios[index].balance += body.amount;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has borrowed ${body.amount} money`,
      });
    }
    await game.save();
  }

  public async idlePlayerToMachineBorrowMoney(
    game: GameDoc,
    body: { portfolio: string; amount: number },
    user: UserDoc
  ) {
    const index = findPortfolio(
      game,
      body.portfolio,
      PortfolioSelect.ChallengerPortfolio
    );
    const totalAmount =
      game.challengerProtfolios[index].borrowAmount + body.amount;
    if (totalAmount > game.leauge.borrowAmount) {
      throw new BadRequestError("Borrow amount limit reached");
    }
    game.challengerProtfolios[index].borrowAmount += body.amount;
    game.challengerBalance += body.amount;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has borrowed ${body.amount} money`,
    });
    await game.save();
  }

  public async idlePlayerToPlayerBorrowMoney(
    game: GameDoc,
    body: { portfolio: string; amount: number; player: string },
    user: UserDoc
  ) {
    if (body.player === "challenger") {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.ChallengerPortfolio
      );
      const totalAmount =
        game.challengerProtfolios[index].borrowAmount + body.amount;
      if (totalAmount > game.leauge.borrowAmount) {
        throw new BadRequestError("Borrow amount limit reached");
      }
      game.challengerProtfolios[index].borrowAmount += body.amount;
      game.challengerBalance += body.amount;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has borrowed ${body.amount} money`,
      });
    } else {
      const index = findPortfolio(
        game,
        body.portfolio,
        PortfolioSelect.RivalPortfolio
      );
      const totalAmount =
        game.rivalProtfolios[index].borrowAmount + body.amount;
      if (totalAmount > game.leauge.borrowAmount) {
        throw new BadRequestError("Borrow amount limit reached");
      }
      game.rivalProtfolios[index].borrowAmount += body.amount;
      game.rivalBalance += body.amount;
      GameHistoryService.create({
        game: game.id,
        user: user.id,
        player: PlayerTeam.Challenger,
        text: `${user.name} has borrowed ${body.amount} money`,
      });
    }

    await game.save();
  }
}

export default new BorrowMoney();
