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
exports.gameProcessor = exports.idelPlayerToMachineGameScheduler = void 0;
const logger_1 = require("../config/logger");
const interface_1 = require("../modules/Games/entity/interface");
const conf_1 = require("./conf");
const Service_1 = __importDefault(require("../modules/Games/Service"));
function idelPlayerToMachineGameScheduler(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const job = yield conf_1.gameAnalyticsQueue.add({ gameId, gameType: interface_1.GameModes.IDLEP2M }, jobOptions);
            console.log(`Game analytics for Idle P2M comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`);
            return;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.idelPlayerToMachineGameScheduler = idelPlayerToMachineGameScheduler;
function gameProcessor(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        const game = yield Service_1.default.get(gameId);
        if (!game) {
            logger_1.Logger.error("Game not found or over");
            return;
        }
        if (game.remainingCamparisons === 0) {
            logger_1.Logger.info("Game has finished");
            return;
        }
        // calculate goals
        let rivalBalance = 0;
        let challengerBalance = 0;
        for (let i = 0; i < game.rivalProtfolios.length; i++) {
            if (game.rivalProtfolios[i].portfolio.coin.quote.USD.price > 0 &&
                game.rivalProtfolios[i].portfolio.coin.quote.USD.price < 1) {
                rivalBalance += Array(game.rivalProtfolios[i].quantity)
                    .fill(game.rivalProtfolios[i].portfolio.coin.quote.USD.price)
                    .reduce((a, c) => a + c, 0);
            }
            else {
                rivalBalance +=
                    game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
                        game.rivalProtfolios[i].quantity;
            }
        }
        for (let i = 0; i < game.challengerProtfolios.length; i++) {
            if (game.challengerProtfolios[i].portfolio.coin.quote.USD.price > 0 &&
                game.challengerProtfolios[i].portfolio.coin.quote.USD.price < 1) {
                challengerBalance += Array(game.challengerProtfolios[i].quantity)
                    .fill(game.challengerProtfolios[i].portfolio.coin.quote.USD.price)
                    .reduce((a, c) => a + c, 0);
            }
            else {
                challengerBalance +=
                    game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
                        game.challengerProtfolios[i].quantity;
            }
        }
        console.log("Challenger Balanc => ", challengerBalance);
        console.log("rivalBalance Balanc => ", rivalBalance);
        if (challengerBalance > rivalBalance) {
            game.challengerGoals += 1;
        }
        else {
            game.rivalGoals += 1;
        }
        game.remainingCamparisons -= 1;
        if (game.remainingCamparisons === 0) {
            logger_1.Logger.info("Game finished");
            if (challengerBalance > rivalBalance) {
                game.winner = game.challenger.id;
            }
            else {
                // @ts-ignore
                game.winner = game.rival.id;
            }
            game.status = interface_1.GameStatus.Over;
        }
        yield game.save();
        return;
    });
}
exports.gameProcessor = gameProcessor;
