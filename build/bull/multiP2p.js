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
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiPlayerToPlayerGameScheduler = void 0;
const interface_1 = require("../modules/Games/entity/interface");
const conf_1 = require("./conf");
function multiPlayerToPlayerGameScheduler(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const future = new Date().setMinutes(new Date().getMinutes() + 5);
            const current = Date.now();
            const jobOptions = {
                delay: future - current,
                repeat: {
                    every: 5 * 60 * 1000,
                    limit: 18, // Run for 90 Minutes
                },
            };
            // Add the job to the queue with the specified options
            const job = yield conf_1.gameAnalyticsQueue.add({ gameId, gameType: interface_1.GameModes.REALP2P }, jobOptions);
            console.log(`Game analytics for Multi Player P2P comparison job scheduled for game with ID ${gameId}. Job ID: ${job.id}`);
            return;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.multiPlayerToPlayerGameScheduler = multiPlayerToPlayerGameScheduler;
