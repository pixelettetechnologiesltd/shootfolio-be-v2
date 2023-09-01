import { GameModes } from "../modules/Games/entity/interface";
import { gameAnalyticsQueue } from "./conf";

export async function idlePlayerToPlayerGameScheduler(gameId: string) {
  try {
    const future = new Date().setHours(new Date().getHours() + 24);
    const current = Date.now();
    const jobOptions = {
      delay: future - current,
      repeat: {
        every: 24 * 60 * 60 * 1000,
        limit: 7, // Run for 7 days
      },
    };

    // Add the job to the queue with the specified options
    const job = await gameAnalyticsQueue.add(
      { gameId, gameType: GameModes.IDLEP2P },
      jobOptions
    );

    console.log(
      `Game analytics for Idle P2P comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`
    );
    return;
  } catch (error) {
    console.log(error);
  }
}
