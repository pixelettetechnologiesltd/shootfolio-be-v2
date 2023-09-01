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
exports.tacke = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../GameHistory/Service"));
const interface_2 = require("../../GameHistory/entity/interface");
const tacke = function (game, body, user) {
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
      const index = game.rivalProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString()
        );
      });
      if (index === -1) {
        throw new badRequest_error_1.BadRequestError("Invalid user to tackle");
      }
      if (game.rivalProtfolios[index].role === interface_1.PlayerRoles.GK) {
        throw new badRequest_error_1.BadRequestError("Goalkeeper can't tackle");
      }
      if (rivalBalance < challengerBalance) {
        throw new badRequest_error_1.BadRequestError(
          "Can't tackle, weak profile!"
        );
      }
      const posseser = game.challengerProtfolios.findIndex(
        (e) => e.ball === true
      );
      if (posseser === -1) {
        throw new badRequest_error_1.BadRequestError(
          "Ball possessor not found"
        );
      }
      const tackler = game.rivalProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString()
        );
      });
      if (tackler === -1) {
        throw new badRequest_error_1.BadRequestError("Tackler not found");
      }
      game.rivalProtfolios[tackler].ball = true;
      game.challengerProtfolios[posseser].ball = false;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Rival,
        text: `${user.name} has tickle the player and got the ball`,
      });
    } else {
      const index = game.challengerProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString()
        );
      });
      if (index === -1) {
        throw new badRequest_error_1.BadRequestError("Invalid user to tackle");
      }
      if (
        game.challengerProtfolios[index].role === interface_1.PlayerRoles.GK
      ) {
        throw new badRequest_error_1.BadRequestError("Goalkeeper can't tackle");
      }
      console.log(challengerBalance, rivalBalance);
      if (challengerBalance < rivalBalance) {
        throw new badRequest_error_1.BadRequestError(
          "You can't tackle, weak profile!"
        );
      }
      const posseser = game.rivalProtfolios.findIndex((e) => e.ball === true);
      if (posseser === -1) {
        throw new badRequest_error_1.BadRequestError(
          "Ball possessor not found"
        );
      }
      const tackler = game.challengerProtfolios.findIndex((e) => {
        var _a;
        return (
          ((_a = e.user) === null || _a === void 0
            ? void 0
            : _a.id.toString()) === user.id.toString()
        );
      });
      if (tackler === -1) {
        throw new badRequest_error_1.BadRequestError("Tackler not found");
      }
      game.challengerProtfolios[tackler].ball = true;
      game.rivalProtfolios[posseser].ball = false;
      Service_1.default.create({
        game: game.id,
        user: user.id,
        player: interface_2.PlayerTeam.Challenger,
        text: `${user.name} has tickle the player and got the ball`,
      });
    }
    return yield game.save();
  });
};
exports.tacke = tacke;
