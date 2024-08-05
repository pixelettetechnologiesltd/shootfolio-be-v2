// bull/comparisonProcessor.ts
import { Job } from 'bull';
import Game from '../../entity/model';
import GameLeague from '../../../../modules/GameLeagues/entity/model';
import { GameStatus } from '../../entity/interface';
import { comparisonQueue } from '../../../../bull/conf';
import { calculatePortfolio } from '.';

interface ComparisonJobData {
  gameId: string;
}

export async function scheduleGameComparison(
  gameId: string,
  gameModeDuration: string
) {
  let repeatInterval: number = 0;

  if (gameModeDuration === '7 Days') {
    repeatInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // repeatInterval = 1 * 60 * 1000; // 1 minutes in milliseconds
  } else if (gameModeDuration === '90 mins') {
    repeatInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  try {
    const jobOptions = {
      repeat: {
        every: repeatInterval,
        limit: gameModeDuration === '7 days' ? 7 : 18,
      },
    };

    await comparisonQueue.add({ gameId }, jobOptions);
  } catch (err) {
    console.error('Error while scheduling game comparison:', err);
  }
}

export async function comparisonProcessor(job: Job<ComparisonJobData>) {
  try {
    const { gameId } = job.data;
  const game = await Game.findById(gameId);

  if (game && game.status !== GameStatus.Over) {
    if (game.remainingCamparisons > 0) {
      console.log(
        'game.remainingCamparisons running',
        --game.remainingCamparisons
      );
      // TODO: Your comparison logic here
      calculatePortfolio(game);

      // const Gameleague = await GameLeague.findById(game.leauge);
      // let totalBudget = 0;
      // if (Gameleague) {
      //   console.log('game league', Gameleague);
      //   totalBudget = Gameleague.investableBudget;
      // }

      // let borrowReturn = ((0.05*totalBudget)+totalBudget)/365;
      // console.log("Borrow Return Amount:",borrowReturn);

      // for (let i = 0; i < game.rivalProtfolios.length; i++) {
      //   if (game.rivalProtfolios[i].borrowAmount - game.rivalProtfolios[i].returnAmount > 0 ) {
      //     game.challengerProtfolios[i].balance -= borrowReturn;
      //     game.rivalProtfolios[i].returnAmount += borrowReturn;
      //   }
      // }
      // for (let i = 0; i < game.challengerProtfolios.length; i++) {
      //   if (game.challengerProtfolios[i].borrowAmount - game.challengerProtfolios[i].returnAmount > 0 ) {
      //     game.challengerProtfolios[i].balance -= borrowReturn;
      //     game.challengerProtfolios[i].returnAmount += borrowReturn;
      //   }
      // }

      // Decrement remaining comparisons and save
      --game.remainingCamparisons;
      await game.save();
    } else {
      // If there's no remaining comparison, it ends the game.
      game.status = GameStatus.Over;
      await game.save();
    }
  }  
  } catch (error) {
    console.log("comparisonProcessor Error", error);
  }
  
}
