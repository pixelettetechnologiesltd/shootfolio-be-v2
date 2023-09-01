import { func } from "joi";
import { BadRequestError } from "../../../../errors/badRequest.error";
import { GameDoc, PortfolioSelect } from "../../entity/interface";
import mongoose from "mongoose";

export const findPortfolio = function (
  game: GameDoc,
  current: string,
  selctor: PortfolioSelect
): number {
  const index = game[selctor].findIndex((e) => {
    console.log(e.portfolio, current);
    return e.portfolio.id.toString() === current.toString();
  });

  if (index === -1) {
    throw new BadRequestError("Invalid portfolio selected");
  }
  return index;
};

export const calculatePortfolio = function (game: GameDoc) {
  // calculate goals
  let rivalBalance = 0;
  let challengerBalance = 0;

  for (let i = 0; i < game.rivalProtfolios.length; i++) {
    rivalBalance +=
      game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
      game.rivalProtfolios[i].quantity;
  }
  for (let i = 0; i < game.challengerProtfolios.length; i++) {
    challengerBalance +=
      game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[i].quantity;
  }
  if (challengerBalance >= rivalBalance) {
    game.challengerGoals += 1;
  } else {
    game.rivalGoals += 1;
  }
  return;
};
