import { Logger } from "../config/logger";
import { GameModes, GameStatus } from "../modules/Games/entity/interface";
import { gameAnalyticsQueue } from "./conf";
import GameService from "../modules/Games/Service";

export async function idelPlayerToMachineGameScheduler(gameId: string) {
  try {
    // const future = new Date(new Date().setDate(new Date().getDate() + 1))
    const future = new Date().setHours(new Date().getHours() + 24);

    const current = Date.now();
    const jobOptions = {
      delay: future - current,
      repeat: {
        // every: 2 * 60 * 1000, // Repeat every 2 minutes
        every: 24 * 60 * 60 * 1000,
        limit: 7, // Run for 7 days
      },
    };
    // Add the job to the queue with the specified options
    const job = await gameAnalyticsQueue.add(
      { gameId, gameType: GameModes.IDLEP2M },
      jobOptions
    );

    console.log(
      `Game analytics for Idle P2M comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`
    );
    return;
  } catch (error) {
    console.log(error);
  }
}

export async function gameProcessor(gameId: string) {
  const game = await GameService.get(gameId);
  if (!game) {
    Logger.error("Game not found or over");
    return;
  }

  if (game.remainingCamparisons === 0) {
    Logger.info("Game has finished");
    return;
  }

  // calculate goals
  let rivalBalance = 0;
  let challengerBalance = 0;

  for (let i = 0; i < game.rivalProtfolios.length; i++) {
    if (
      game.rivalProtfolios[i].portfolio.coin.quote.USD.price > 0 &&
      game.rivalProtfolios[i].portfolio.coin.quote.USD.price < 1
    ) {
      rivalBalance += Array(game.rivalProtfolios[i].quantity)
        .fill(game.rivalProtfolios[i].portfolio.coin.quote.USD.price)
        .reduce((a: number, c: number) => a + c, 0);
    } else {
      rivalBalance +=
        game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
        game.rivalProtfolios[i].quantity;
    }
  }
  for (let i = 0; i < game.challengerProtfolios.length; i++) {
    if (
      game.challengerProtfolios[i].portfolio.coin.quote.USD.price > 0 &&
      game.challengerProtfolios[i].portfolio.coin.quote.USD.price < 1
    ) {
      challengerBalance += Array(game.challengerProtfolios[i].quantity)
        .fill(game.challengerProtfolios[i].portfolio.coin.quote.USD.price)
        .reduce((a: number, c: number) => a + c, 0);
    } else {
      challengerBalance +=
        game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
        game.challengerProtfolios[i].quantity;
    }
  }
  console.log("Challenger Balanc => ", challengerBalance);
  console.log("rivalBalance Balanc => ", rivalBalance);

  if (challengerBalance > rivalBalance) {
    game.challengerGoals += 1;
  } else {
    game.rivalGoals += 1;
  }
  game.remainingCamparisons -= 1;
  if (game.remainingCamparisons === 0) {
    Logger.info("Game finished");
    if (challengerBalance > rivalBalance) {
      game.winner = game.challenger.id;
    } else {
      // @ts-ignore
      game.winner = game.rival.id;
    }
    game.status = GameStatus.Over;
  }
  await game.save();

  return;
}
