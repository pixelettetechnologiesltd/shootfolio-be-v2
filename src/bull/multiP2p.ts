import { GameModes } from "../modules/Games/entity/interface";
import { gameAnalyticsQueue } from "./conf";

export async function multiPlayerToPlayerGameScheduler(gameId: string) {
  try {
    const future = new Date().setMinutes(new Date().getMinutes() + 5);
    const current = Date.now();
    const jobOptions = {
      delay: future - current, // 5 minutes delay before the first run
      repeat: {
        every: 5 * 60 * 1000, // Repeat every 2 minutes
        limit: 18, // Run for 90 Minutes
      },
    };

    // Add the job to the queue with the specified options
    const job = await gameAnalyticsQueue.add(
      { gameId, gameType: GameModes.REALP2P },
      jobOptions
    );
    console.log(
      `Game analytics for Multi Player P2P comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`
    );
    return;
  } catch (error) {
    console.log(error);
  }
}
