import { GameModes } from "../modules/Games/entity/interface";
import { gameAnalyticsQueue } from "./conf";

export async function realTimePlayerToPlayerGameScheduler(gameId: string) {
  console.log(`AE013`);
  try {
    console.log(`AE014`);

    const future = new Date().setMinutes(new Date().getMinutes() + 5);
    const current = Date.now();
    const jobOptions = {
      delay: future - current, // 5 minutes delay before the first run
      repeat: {
        every: 5 * 60 * 1000, // Repeat every 5 minutes
        limit: 18, // Run for 90 Minutes
      },
    };
    console.log(`AE015`);

    // Add the job to the queue with the specified options
    const job = await gameAnalyticsQueue.add(
      { gameId, gameType: GameModes.REALP2P },
      jobOptions
    );

    console.log(
      `AE012: Game analytics for Real Time P2P comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`
    );

    return;
  } catch (error) {
    console.log(error);
  }
}
