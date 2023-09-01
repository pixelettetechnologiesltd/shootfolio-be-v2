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
exports.shoot = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../GameHistory/Service"));
const interface_2 = require("../../GameHistory/entity/interface");
const shoot = function (game, body, user) {
  return __awaiter(this, void 0, void 0, function* () {
    if (
      game.status === interface_1.GameStatus.Pending ||
      game.status === interface_1.GameStatus.Over
    ) {
      throw new badRequest_error_1.BadRequestError(
        "Game is over or not started"
      );
    }
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
    if (body.player === "rival") {
      const possesser = game.rivalProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString() && e.ball == true
        );
      });
      if (possesser === -1) {
        throw new badRequest_error_1.BadRequestError(
          "Invalid user to shoot the ball"
        );
      }
      if (game.rivalProtfolios[possesser].role === interface_1.PlayerRoles.GK) {
        throw new badRequest_error_1.BadRequestError(
          "Goalkeeper can't shoot the ball"
        );
      }
      if (rivalBalance < challengerBalance) {
        throw new badRequest_error_1.BadRequestError(
          "Can't shoot, weak profile!"
        );
      }
      const goalKeeper = game.challengerProtfolios.findIndex(
        (e) => e.role === interface_1.PlayerRoles.GK
      );
      const goalKeeperBalance =
        game.challengerProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
        game.challengerProtfolios[goalKeeper].quantity;
      const attackerBalance =
        game.rivalProtfolios[possesser].portfolio.coin.quote.USD.price *
        game.rivalProtfolios[possesser].quantity;
      if (attackerBalance < goalKeeperBalance) {
        throw new badRequest_error_1.BadRequestError("Weak profile to shoot!");
      }
      game.rivalProtfolios[possesser].ball = false;
      game.challengerProtfolios[goalKeeper].ball = true;
      game.rivalGoals += 1;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Rival,
        text: `${user.name} has shoot the ball and secure a goal`,
      });
    } else {
      const possesser = game.challengerProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString() && e.ball == true
        );
      });
      if (possesser === -1) {
        throw new badRequest_error_1.BadRequestError(
          "Invalid user to shoot the ball"
        );
      }
      if (
        game.challengerProtfolios[possesser].role === interface_1.PlayerRoles.GK
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Goalkeeper can't shoot the ball"
        );
      }
      if (rivalBalance < challengerBalance) {
        throw new badRequest_error_1.BadRequestError(
          "Can't shoot, weak profile!"
        );
      }
      const goalKeeper = game.rivalProtfolios.findIndex(
        (e) => e.role === interface_1.PlayerRoles.GK
      );
      const goalKeeperBalance =
        game.rivalProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
        game.rivalProtfolios[goalKeeper].quantity;
      const attackerBalance =
        game.challengerProtfolios[possesser].portfolio.coin.quote.USD.price *
        game.challengerProtfolios[goalKeeper].quantity;
      if (attackerBalance < goalKeeperBalance) {
        throw new badRequest_error_1.BadRequestError("Weak profile to shoot!");
      }
      game.challengerProtfolios[possesser].ball = false;
      game.rivalProtfolios[goalKeeper].ball = true;
      game.challengerGoals += 1;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Challenger,
        text: `${user.name} has shoot the ball and secure a goal`,
      });
    }
    return yield game.save();
  });
};
exports.shoot = shoot;
