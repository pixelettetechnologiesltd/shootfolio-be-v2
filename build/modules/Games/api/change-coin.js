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
const model_1 = __importDefault(require("../../CryptoCoins/entity/model"));
const interface_1 = require("../entity/interface");
const utils_1 = require("../lib/utils");
const Service_1 = __importDefault(require("../../Portfolio/Service"));
const interface_2 = require("../../Portfolio/entity/interface");
const model_2 = __importDefault(require("../entity/model"));
const Service_2 = __importDefault(require("../../GameHistory/Service"));
const interface_3 = require("../../GameHistory/entity/interface");
class ChangeCoin {
  idlePlayerToMachineChangeCoin(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (
        game.challengerProtfolios.some(
          (e) => e.portfolio.coin._id.toString() === body.newPortfolio
        )
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Portfolio already exists, select a different asset"
        );
      }
      const coin = yield model_1.default.findById(body.newPortfolio);
      if (!coin) {
        throw new badRequest_error_1.BadRequestError("No coin found!");
      }
      const index = (0, utils_1.findPortfolio)(
        game,
        body.currentPortfolio,
        interface_1.PortfolioSelect.ChallengerPortfolio
      );
      let previous = game.challengerProtfolios[index];
      game.challengerBalance +=
        previous.portfolio.coin.quote.USD.price * previous.quantity;
      if (game.challengerBalance < coin.quote.USD.price * body.quantity) {
        throw new badRequest_error_1.BadRequestError(
          "You balance is not enough!"
        );
      }
      const newPortfolio = yield Service_1.default.create({
        user: user.id,
        coin: coin._id,
        admin: null,
        // @ts-ignore
        club: game.challengerClub,
        playerType: interface_2.PlayerType.Real,
        quantity: body.quantity,
      });
      game.challengerBalance -= coin.quote.USD.price * body.quantity;
      game.challengerProtfolios[index] = {
        portfolio: newPortfolio.id,
        quantity: body.quantity,
        user: null,
        ball: false,
        balance: 0,
        role: null,
        borrowAmount: previous.borrowAmount,
      };
      yield model_2.default.populate(game, {
        path: "challengerProtfolios.portfolio",
      });
      (0, utils_1.calculatePortfolio)(game);
      Service_2.default.create({
        game: game.id,
        user: user.id,
        player: interface_3.PlayerTeam.Challenger,
        text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
      });
      yield game.save();
    });
  }
  idlePlayerToPlayerChangeCoin(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (
        game.challengerProtfolios.some(
          (e) => e.portfolio.coin._id.toString() === body.newPortfolio
        )
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Portfolio already exists, select a different asset"
        );
      }
      const coin = yield model_1.default.findById(body.newPortfolio);
      if (!coin) {
        throw new badRequest_error_1.BadRequestError("No coin found!");
      }
      const index = (0, utils_1.findPortfolio)(
        game,
        body.currentPortfolio,
        interface_1.PortfolioSelect.ChallengerPortfolio
      );
      let previous = game.challengerProtfolios[index];
      game.challengerBalance -= coin.quote.USD.price * body.quantity;
      if (game.challenger.id.toString() === user.id.toString()) {
        if (game.challengerBalance < coin.quote.USD.price * body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You balance is not enough!"
          );
        }
        const newPortfolio = yield Service_1.default.create({
          user: user.id,
          coin: coin._id,
          admin: null,
          // @ts-ignore
          club: game.challengerClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.quantity,
        });
        game.challengerBalance +=
          previous.portfolio.coin.quote.USD.price * previous.quantity;
        game.challengerProtfolios[index] = {
          portfolio: newPortfolio.id,
          quantity: body.quantity,
          user: null,
          ball: false,
          balance: 0,
          role: null,
          borrowAmount: previous.borrowAmount,
        };
        yield model_2.default.populate(game, {
          path: "challengerProtfolios.portfolio",
        });
        Service_2.default.create({
          game: game.id,
          user: user.id,
          player: interface_3.PlayerTeam.Challenger,
          text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
        });
        (0, utils_1.calculatePortfolio)(game);
      } else {
        if (
          game.rivalProtfolios.some(
            (e) => e.portfolio.coin._id.toString() === body.newPortfolio
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Portfolio already exists, select a different asset"
          );
        }
        const index = (0, utils_1.findPortfolio)(
          game,
          body.currentPortfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        let previous = game.rivalProtfolios[index];
        game.challengerBalance -= coin.quote.USD.price * body.quantity;
        if (game.rivalBalance < coin.quote.USD.price * body.quantity) {
          throw new badRequest_error_1.BadRequestError(
            "You balance is not enough!"
          );
        }
        const newPortfolio = yield Service_1.default.create({
          user: user.id,
          coin: coin._id,
          admin: null,
          // @ts-ignore
          club: game.challengerClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.quantity,
        });
        game.challengerBalance +=
          previous.portfolio.coin.quote.USD.price * previous.quantity;
        game.rivalProtfolios[index] = {
          portfolio: newPortfolio.id,
          quantity: body.quantity,
          user: null,
          ball: false,
          balance: 0,
          role: null,
          borrowAmount: previous.borrowAmount,
        };
        yield model_2.default.populate(game, {
          path: "rivalProtfolios.portfolio",
        });
        Service_2.default.create({
          game: game.id,
          user: user.id,
          player: interface_3.PlayerTeam.Rival,
          text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.rivalProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
        });
        (0, utils_1.calculatePortfolio)(game);
      }
      yield game.save();
    });
  }
  multiPlayerToPlayerChangeCoin(game, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (body.player == "rival") {
        if (
          game.rivalProtfolios.some(
            (e) => e.portfolio.coin._id.toString() === body.newPortfolio
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Portfolio already exists, select a different asset"
          );
        }
        const coin = yield model_1.default.findById(body.newPortfolio);
        if (!coin) {
          throw new badRequest_error_1.BadRequestError("No coin found!");
        }
        const index = (0, utils_1.findPortfolio)(
          game,
          body.currentPortfolio,
          interface_1.PortfolioSelect.RivalPortfolio
        );
        let previous = game.rivalProtfolios[index];
        game.rivalBalance -= coin.quote.USD.price * body.quantity;
        // @ts-ignore
        if (previous.user.id.toString() === user.id.toString()) {
          if (
            coin.quote.USD.price * previous.quantity >
            game.leauge.investableBudget / 5
          ) {
            throw new badRequest_error_1.BadRequestError(
              "You balance is not enough!"
            );
          }
          const newPortfolio = yield Service_1.default.create({
            user: user.id,
            coin: coin._id,
            admin: null,
            club: game.rivalClub,
            playerType: interface_2.PlayerType.Real,
            quantity: body.quantity,
          });
          game.rivalBalance += coin.quote.USD.price * previous.quantity;
          game.rivalProtfolios[index] = {
            portfolio: newPortfolio.id,
            quantity: body.quantity,
            user: user.id,
            ball: previous.ball,
            balance:
              game.leauge.investableBudget / 5 -
              coin.quote.USD.price * body.quantity,
            role: previous.role,
            borrowAmount: previous.borrowAmount,
          };
          yield model_2.default.populate(game, {
            path: "rivalProtfolios.portfolio",
          });
          yield model_2.default.populate(game, {
            path: "rivalProtfolios.portfolio.user",
          });
          Service_2.default.create({
            game: game.id,
            user: user.id,
            player: interface_3.PlayerTeam.Rival,
            text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.rivalProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
          });
          (0, utils_1.calculatePortfolio)(game);
        } else {
          throw new badRequest_error_1.BadRequestError(
            "You cannot change other portfolios"
          );
        }
      } else {
        if (
          game.challengerProtfolios.some(
            (e) => e.portfolio.coin._id.toString() === body.newPortfolio
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Portfolio already exists, select a different asset"
          );
        }
        const coin = yield model_1.default.findById(body.newPortfolio);
        if (!coin) {
          throw new badRequest_error_1.BadRequestError("No coin found!");
        }
        const index = (0, utils_1.findPortfolio)(
          game,
          body.currentPortfolio,
          interface_1.PortfolioSelect.ChallengerPortfolio
        );
        let previous = game.challengerProtfolios[index];
        game.challengerBalance -= coin.quote.USD.price * body.quantity;
        // @ts-ignore
        if (previous.user.id.toString() === user.id.toString()) {
          if (
            coin.quote.USD.price * previous.quantity >
            game.leauge.investableBudget / 5
          ) {
            throw new badRequest_error_1.BadRequestError(
              "You balance is not enough!"
            );
          }
          const newPortfolio = yield Service_1.default.create({
            user: user.id,
            coin: coin._id,
            admin: null,
            club: game.challengerClub,
            playerType: interface_2.PlayerType.Real,
            quantity: body.quantity,
          });
          game.challengerBalance += coin.quote.USD.price * previous.quantity;
          game.challengerProtfolios[index] = {
            portfolio: newPortfolio.id,
            quantity: body.quantity,
            user: user.id,
            ball: previous.ball,
            balance:
              game.leauge.investableBudget / 5 -
              coin.quote.USD.price * body.quantity,
            role: previous.role,
            borrowAmount: previous.borrowAmount,
          };
          yield model_2.default.populate(game, {
            path: "challengerProtfolios.portfolio",
          });
          yield model_2.default.populate(game, {
            path: "challengerProtfolios.portfolio.user",
          });
          Service_2.default.create({
            game: game.id,
            user: user.id,
            player: interface_3.PlayerTeam.Challenger,
            text: `${user.name} has changed the coin from ${previous.portfolio.coin.name} to ${game.challengerProtfolios[index].portfolio.coin.name} with quantity to ${body.quantity}`,
          });
          (0, utils_1.calculatePortfolio)(game);
        } else {
          throw new badRequest_error_1.BadRequestError(
            "You cannot change other portfolios"
          );
        }
      }
      yield game.save();
    });
  }
}
exports.default = new ChangeCoin();
