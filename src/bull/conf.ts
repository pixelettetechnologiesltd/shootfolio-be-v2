// bullQueue.js
import Queue, { QueueOptions } from "bull";
import { GameModes } from "../modules/Games/entity/interface";
import { gameProcessor } from "./idleP2m";

// Create Bull Queue with MongoDB adapter
const queueOptions: QueueOptions = {
  limiter: {
    max: 10,
    duration: 1000, // Default duration in milliseconds (adjust as needed)
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
  settings: {
    lockDuration: 30000,
  },
  // redis: process.env.REDIS_URI,
};

// Create the Queue with the specified QueueOptions
const gameAnalyticsQueue = new Queue("gameAnalyticsQueue", queueOptions);

gameAnalyticsQueue.process(async (job) => {
  // Implement your game analytics comparison logic here
  const { gameId, gameType } = job.data;
  console.log(
    `Processing game analytics for game with ID ${gameId}... and Game Mode ${gameType}`
  );
  gameProcessor(gameId);
  console.log(`Game analytics comparison for game with ID ${gameId} complete.`);
});

// Export the initialized Bull Queue
export { gameAnalyticsQueue };
