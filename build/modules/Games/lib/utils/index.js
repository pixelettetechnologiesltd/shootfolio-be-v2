"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePortfolio = exports.findPortfolio = void 0;
const badRequest_error_1 = require("../../../../errors/badRequest.error");
const findPortfolio = function (game, current, selctor) {
    const index = game[selctor].findIndex((e) => {
        console.log(e.portfolio, current);
        return e.portfolio.id.toString() === current.toString();
    });
    if (index === -1) {
        throw new badRequest_error_1.BadRequestError("Invalid portfolio selected");
    }
    return index;
};
exports.findPortfolio = findPortfolio;
const calculatePortfolio = function (game) {
    // calculate goals
    let rivalBalance = 0;
    let challengerBalance = 0;
    for (let i = 0; i < game.rivalProtfolios.length; i++) {
        rivalBalance +=
            game.rivalProtfolios[i].portfolio.coin.quote.USD.price *
                game.rivalProtfolios[i].quantity;
    }
    for (let i = 0; i < game.challengerProtfolios.length; i++) {
        challengerBalance +=
            game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
                game.challengerProtfolios[i].quantity;
    }
    if (challengerBalance >= rivalBalance) {
        game.challengerGoals += 1;
    }
    else {
        game.rivalGoals += 1;
    }
    return;
};
exports.calculatePortfolio = calculatePortfolio;
