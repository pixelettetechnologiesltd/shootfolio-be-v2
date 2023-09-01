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
class SellCoin {
  multiPlayerToPlayerSellCoin(game, body, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (body.player == "rival") {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        if (game.rivalProtfolios[index].quantity < body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You dont have enough assets to sell for this potfolio"
          );
        }
        if (
          ((_a = game.rivalProtfolios[index].user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) !== user.id.toString()
        ) {
          throw new badRequest_error_1.BadRequestError(
            "You cannot sell other player assets"
          );
        }
        game.rivalProtfolios[index].balance +=
          game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        game.rivalProtfolios[index].quantity -= body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Rival,
          text: `${user.name} has sell ${body.quantity} of ${game.rivalProtfolios[index].portfolio.coin} worth ${game.rivalProtfolios[index].portfolio.coin.quote.USD.price}`,
        });
      } else {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.ChallengerPortfolio
        );
        if (game.challengerProtfolios[index].quantity < body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You dont have enough assets to sell for this potfolio"
          );
        }
        if (
          ((_b = game.challengerProtfolios[index].user) === null ||
          _b === void 0
            ? void 0
            : _b.id.toString()) !== user.id.toString()
        ) {
          throw new badRequest_error_1.BadRequestError(
            "You cannot sell other player assets"
          );
        }
        game.challengerProtfolios[index].balance +=
          game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        game.challengerProtfolios[index].quantity -= body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Challenger,
          text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin} worth ${game.challengerProtfolios[index].portfolio.coin.quote.USD.price}`,
        });
      }
      yield game.save();
    });
  }
  idlePlayerToPlayerSell(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (game.challenger.id.toString() === user.id.toString()) {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.ChallengerPortfolio
        );
        if (game.challengerProtfolios[index].quantity < body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You dont have enough assets to sell for this potfolio"
          );
        }
        game.challengerBalance +=
          game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        game.challengerProtfolios[index].quantity -= body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Challenger,
          text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin} worth ${game.challengerProtfolios[index].portfolio.coin.quote.USD.price}`,
        });
      } else {
        const index = (0, utils_1.findPortfolio)(
          game,
          body.portfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        if (game.rivalProtfolios[index].quantity < body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You dont have enough assets to sell for this potfolio"
          );
        }
        game.rivalBalance +=
          game.rivalProtfolios[index].portfolio.coin.quote.USD.price *
          body.quantity;
        game.rivalProtfolios[index].quantity -= body.quantity;
        Service_1.default.create({
          game: game.id,
          user: user.id,
          player: interface_2.PlayerTeam.Rival,
          text: `${user.name} has sell ${body.quantity} of ${game.rivalProtfolios[index].portfolio.coin} worth ${game.rivalProtfolios[index].portfolio.coin.quote.USD.price}`,
        });
      }
      yield game.save();
    });
  }
  idlePlayerToMachineSell(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const index = (0, utils_1.findPortfolio)(
        game,
        body.portfolio,
        interface_1.PortfolioSelect.ChallengerPortfolio
      );
      if (game.challengerProtfolios[index].quantity < body.quantity) {
        throw new badRequest_error_1.BadRequestError(
          "You dont have enough assets to sell for this potfolio"
        );
      }
      game.challengerBalance +=
        game.challengerProtfolios[index].portfolio.coin.quote.USD.price *
        body.quantity;
      game.challengerProtfolios[index].quantity -= body.quantity;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Challenger,
        text: `${user.name} has sell ${body.quantity} of ${game.challengerProtfolios[index].portfolio.coin} worth ${game.challengerProtfolios[index].portfolio.coin.quote.USD.price}`,
      });
      yield game.save();
    });
  }
}
exports.default = new SellCoin();
