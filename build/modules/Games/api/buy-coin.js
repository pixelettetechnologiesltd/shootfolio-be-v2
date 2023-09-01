"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const badRequest_error_1 = require("../../../errors/badRequest.error");
const interface_1 = require("../entity/interface");
const utils_1 = require("../lib/utils");
const Service_1 = __importDefault(require("../../GameHistory/Service"));
const interface_2 = require("../../GameHistory/entity/interface");
class BuyCoin {
  multiPlayerToPlayerBuyCoin(game, body, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (body.player == "rival") {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        if (
          ((_a = game.rivalProtfolios[index].user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) !== user.id.toString()
        ) {
          throw new badRequest_error_1.BadRequestError("Unable to buy coin");
        }
        let cost =
          game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        if (cost > game.rivalProtfolios[index].balance) {
          throw new badRequest_error_1.BadRequestError(
            "You don't have enough balance to buy more assets"
          );
        }
        game.rivalProtfolios[index].balance -= cost;
        game.rivalProtfolios[index].quantity += body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Rival,
          text: `${user.name} has bought ${body.quantity} ${game.rivalProtfolios[index].portfolio.coin.name} worth ${cost}`,
        });
      } else {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.ChallengerPortfolio
        );
        if (
          ((_b = game.challengerProtfolios[index].user) === null ||
          _b === void 0
            ? void 0
            : _b.id.toString()) !== user.id.toString()
        ) {
          throw new badRequest_error_1.BadRequestError("Unable to buy coin");
        }
        let cost =
          game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        if (cost > game.challengerProtfolios[index].balance) {
          throw new badRequest_error_1.BadRequestError(
            "You don't have enough balance to buy more assets"
          );
        }
        game.challengerProtfolios[index].balance -= cost;
        game.challengerProtfolios[index].quantity += body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Challenger,
          text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
        });
      }
      yield game.save();
    });
  }
  idlePlayerToMachineBuy(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const index = (0, utils_1.findPortfolio)(
        game,
        body.portfolio,
        interface_1.PortfolioSelect.ChallengerPortfolio
      );
      let cost =
        body.quantity *
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price;
      if (cost > game.challengerBalance) {
        throw new badRequest_error_1.BadRequestError(
          "You don't have enough balance to buy more assets"
        );
      }
      game.challengerProtfolios[index].quantity += body.quantity;
      game.challengerBalance -= cost;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Challenger,
        text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
      });
      yield game.save();
    });
  }
  idlePlayerToPlayerBuy(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (game.challenger.id.toString() === user.id.toString()) {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.ChallengerPortfolio
        );
        let cost =
          body.quantity *
          game.challengerProtfolios[index].portfolio.coin.quote.USD.price;
        if (cost > game.challengerBalance) {
          throw new badRequest_error_1.BadRequestError(
            "You don't have enough balance to buy more assets"
          );
        }
        game.challengerProtfolios[index].quantity += body.quantity;
        game.challengerBalance -= cost;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Challenger,
          text: `${user.name} has bought ${body.quantity} ${game.challengerProtfolios[index].portfolio.coin.name} worth ${cost}`,
        });
      } else {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        let cost =
          body.quantity *
          game.rivalProtfolios[index].portfolio.coin.quote.USD.price;
        if (cost > game.challengerBalance) {
          throw new badRequest_error_1.BadRequestError(
            "You don't have enough balance to buy more assets"
          );
        }
        game.rivalProtfolios[index].quantity += body.quantity;
        game.rivalBalance -= cost;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Rival,
          text: `${user.name} has bought ${body.quantity} ${game.rivalProtfolios[index].portfolio.coin.name} worth ${cost}`,
        });
      }
      yield game.save();
    });
  }
}
exports.default = new BuyCoin();
