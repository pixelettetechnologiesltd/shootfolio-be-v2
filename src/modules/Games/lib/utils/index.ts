import { func } from "joi";
import { BadRequestError } from "../../../../errors/badRequest.error";
import { GameDoc, PortfolioSelect, GameModes } from "../../entity/interface";
import mongoose from "mongoose";

export const findPortfolio = function (
  game: GameDoc,
  current: string,
  selctor: PortfolioSelect
): number {
  const index = game[selctor].findIndex((e) => {
    return e.portfolio.id.toString() === current.toString();
  });

  if (index === -1) {
    throw new BadRequestError("Invalid portfolio selected");
  }
  return index;
};

export const calculatePortfolio = function (game: GameDoc) {
  // calculate goals
  if (game.remainingCamparisons <= 0) {
    return;
  }
  let rivalBalance = game.rivalBalance;
  let challengerBalance = game.challengerBalance;
  if (game.gameMode.modeTitle === GameModes.MULTP2P) {
    rivalBalance = 0;
    challengerBalance = 0;
    for (let i = 0; i < game.rivalProtfolios.length; i++) {
      rivalBalance += game.rivalProtfolios[i].balance;
      rivalBalance +=
        game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
        game.rivalProtfolios[i].quantity;

      rivalBalance -= game.rivalProtfolios[i].borrowAmount;
      rivalBalance += game.rivalProtfolios[i].returnAmount;
    }
    for (let i = 0; i < game.challengerProtfolios.length; i++) {
      challengerBalance += game.challengerProtfolios[i].balance;
      challengerBalance +=
        game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
        game.challengerProtfolios[i].quantity;

      challengerBalance -= game.challengerProtfolios[i].borrowAmount;
      challengerBalance += game.challengerProtfolios[i].returnAmount;
    }
  } else {
    for (let i = 0; i < game.rivalProtfolios.length; i++) {
      rivalBalance +=
        game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
        game.rivalProtfolios[i].quantity;

      rivalBalance -= game.rivalProtfolios[i].borrowAmount;
      rivalBalance += game.rivalProtfolios[i].returnAmount;
    }
    for (let i = 0; i < game.challengerProtfolios.length; i++) {
      challengerBalance +=
        game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
        game.challengerProtfolios[i].quantity;

      challengerBalance -= game.challengerProtfolios[i].borrowAmount;
      challengerBalance += game.challengerProtfolios[i].returnAmount;
    }
  }
  
  let totalRivalChangeBalance = rivalBalance - game.rivalPrevTeamBalance;
  let totalChallengerChangeBalance = challengerBalance - game.challengerPrevTeamBalance;
  console.log("Rival A010", totalRivalChangeBalance);
  console.log("Challenger A010", totalChallengerChangeBalance);

  game.rivalPrevTeamBalance = rivalBalance;
  game.challengerPrevTeamBalance = challengerBalance;

  if (totalChallengerChangeBalance > totalRivalChangeBalance) {
    game.challengerGoals += 1;
    game.remainingCamparisons -=1;
  }
  if (totalChallengerChangeBalance < totalRivalChangeBalance) {
    game.rivalGoals += 1;
    game.remainingCamparisons -=1;
  }

  return;
};
