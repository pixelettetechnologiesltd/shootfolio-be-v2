// bullQueue.js
// import Redis from 'ioredis';
import Queue, { QueueOptions } from 'bull';
import { RedisOptions } from 'ioredis';
import { GameModes } from '../modules/Games/entity/interface';
import { gameProcessor } from './idleP2m';
import { endGame } from '../modules/Games/lib/utils/scheduleGameOver';
import { comparisonProcessor } from '../modules/Games/lib/utils/comparisonProcessor';
// import {comparisonWorker} from '../modules/Games/lib/utils/'

if (!process.env.REDIS_URI) {
  throw new Error('REDIS_URI is not defined in the environment variables.');
}
const redisURI = new URL(process.env.REDIS_URI);
// const redisConfig = new Redis(redisURI).options;
// Create Bull Queue with MongoDB adapter
// Updated Redis configuration with correct TLS type
const redisConfig: RedisOptions = {
  tls: {
    // Include any specific TLS options here if needed
  },
  enableTLSForSentinelMode: false,
  host: redisURI.hostname,
  port: parseInt(redisURI.port), // Extracted from URI
  password: redisURI.password,
  // The db number is not explicitly specified in the URI, so default to 0
  db: 0,
};

// Create Bull Queue with updated Redis configuration
const queueOptions: QueueOptions = {
  limiter: {
    max: 10,
    duration: 1000,
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
  settings: {
    lockDuration: 30000,
  },
  redis: redisConfig, // Use the updated Redis configuration
};

// Create the Queue with the specified QueueOptions
const gameAnalyticsQueue = new Queue('gameAnalyticsQueue', queueOptions);

gameAnalyticsQueue.process(async (job) => {
  // Implement your game analytics comparison logic here
  const { gameId, gameType } = job.data;
  console.log(
    `Processing game analytics for game with ID ${gameId}... and Game Mode ${gameType}`
  );
  gameProcessor(gameId);
  console.log(`Game analytics comparison for game with ID ${gameId} complete.`);
});

// Add the new queue for handling game expiry
const gameExpiryQueue = new Queue('gameExpiryQueue', queueOptions);

gameExpiryQueue.process(async (job) => {
  await endGame(job.data);
});

// Queue to handle game comparisons
const comparisonQueue = new Queue('comparisonQueue', queueOptions);

// comparisonQueue.process(async (job) => {
//   await comparisonProcessor(job);
// });

// Export the initialized Bull Queue
export { gameAnalyticsQueue, gameExpiryQueue, comparisonQueue };
