"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameAnalyticsQueue = void 0;
// bullQueue.js
const bull_1 = __importDefault(require("bull"));
const idleP2m_1 = require("./idleP2m");
// Create Bull Queue with MongoDB adapter
const queueOptions = {
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
const gameAnalyticsQueue = new bull_1.default("gameAnalyticsQueue", queueOptions);
exports.gameAnalyticsQueue = gameAnalyticsQueue;
gameAnalyticsQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement your game analytics comparison logic here
    const { gameId, gameType } = job.data;
    console.log(`Processing game analytics for game with ID ${gameId}... and Game Mode ${gameType}`);
    (0, idleP2m_1.gameProcessor)(gameId);
    console.log(`Game analytics comparison for game with ID ${gameId} complete.`);
}));
