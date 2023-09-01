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
const interface_1 = require("./entity/interface");
const model_1 = __importDefault(require("./entity/model"));
const badRequest_error_1 = require("../../errors/badRequest.error");
const Service_1 = __importDefault(require("../GameModes/Service"));
const idleP2M_1 = require("./lib/idleP2M");
const idleP2P_1 = require("./lib/idleP2P");
const realP2P_1 = require("./lib/realP2P");
const multiP2P_1 = require("./lib/multiP2P");
const sell_coin_1 = __importDefault(require("./api/sell-coin"));
const buy_coin_1 = __importDefault(require("./api/buy-coin"));
const change_coin_1 = __importDefault(require("./api/change-coin"));
const pass_ball_1 = require("./api/pass-ball");
const tackle_1 = require("./api/tackle");
const shoot_1 = require("./api/shoot");
const borrow_money_1 = __importDefault(require("./api/borrow-money"));
class Service {
  constructor() {}
  /**
   *
   * @param body
   * @returns  {Promise<GameDoc>}
   */
  create(body, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      // check if both clubs are not same
      if (
        !body.club &&
        ((_a = body.challengerClub) === null || _a === void 0
          ? void 0
          : _a.toString()) ===
          ((_b = body.rivalClub) === null || _b === void 0
            ? void 0
            : _b.toString())
      ) {
        throw new badRequest_error_1.BadRequestError(
          "You can not compete with same club"
        );
      }
      // check if player is already competing
      if (
        yield model_1.default.findOne({
          $or: [
            {
              challenger: user.id,
            },
            {
              rival: user.id,
            },
            { "rivalProtfolios.user": user.id },
            { "challengerClub.user": user.id },
          ],
        })
      ) {
        throw new badRequest_error_1.BadRequestError(
          "You are already playing; the game is not over yet!"
        );
      }
      const gameMode = yield Service_1.default.get(body.gameMode.toString());
      switch (gameMode.modeTitle) {
        case interface_1.GameModes.IDLEP2M:
          return yield (0,
          idleP2M_1.idlePlayerToMachineGame)(body, user, gameMode);
        case interface_1.GameModes.IDLEP2P:
          return yield (0,
          idleP2P_1.idlePlayerToPlayerGame)(body, user, gameMode);
        case interface_1.GameModes.REALP2P:
          return yield (0,
          realP2P_1.realPlayerToPlayerGame)(body, user, gameMode);
        case interface_1.GameModes.MULTP2P:
          return yield (0,
          multiP2P_1.multiPlayerToPlayerGame)(body, user, gameMode);
      }
    });
  }
  /**
   *
   * @param filter
   * @param options
   * @returns {Promise<PaginationResult>}
   */
  query(filter, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const results = yield model_1.default.paginate(filter, options);
      return results;
    });
  }
  /**
   *
   * @param id
   * @returns {Promise<GameDoc> }
   */
  get(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield model_1.default.findById(id);
      if (!doc) {
        throw new badRequest_error_1.BadRequestError("Game not found");
      }
      return doc;
    });
  }
  /**
   *
   * @param id
   * @param updateBody
   * @returns { Promise<GameDoc>}
   */
  update(id, updateBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield this.get(id);
      Object.assign(doc, updateBody);
      yield doc.save();
      return doc;
    });
  }
  /**
   *
   * @param id
   * @returns {Promise<message: string>}
   */
  delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
      const doc = yield this.get(id);
      yield doc.remove();
      return { message: "Game deleted successfully" };
    });
  }
  sell(id, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(id);
      if (
        game.status == interface_1.GameStatus.Cancelled ||
        game.status === interface_1.GameStatus.Over
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Game is over or cancelled"
        );
      }
      switch (game.gameMode.modeTitle) {
        case interface_1.GameModes.IDLEP2M:
          yield sell_coin_1.default.idlePlayerToMachineSell(game, body, user);
          break;
        case interface_1.GameModes.IDLEP2P:
        case interface_1.GameModes.REALP2P:
          yield sell_coin_1.default.idlePlayerToPlayerSell(game, body, user);
          break;
        case interface_1.GameModes.MULTP2P:
          yield sell_coin_1.default.multiPlayerToPlayerSellCoin(
            game,
            body,
            user
          );
          break;
      }
      return game;
    });
  }
  buy(id, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(id);
      if (
        game.status == interface_1.GameStatus.Cancelled ||
        game.status === interface_1.GameStatus.Over
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Game is over or cancelled"
        );
      }
      switch (game.gameMode.modeTitle) {
        case interface_1.GameModes.IDLEP2M:
          yield buy_coin_1.default.idlePlayerToMachineBuy(game, body, user);
          break;
        case interface_1.GameModes.IDLEP2P:
        case interface_1.GameModes.REALP2P:
          yield buy_coin_1.default.idlePlayerToPlayerBuy(game, body, user);
          break;
        case interface_1.GameModes.MULTP2P:
          yield buy_coin_1.default.multiPlayerToPlayerBuyCoin(game, body, user);
          break;
      }
      return game;
    });
  }
  changeCoin(id, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(id);
      if (
        game.status == interface_1.GameStatus.Cancelled ||
        game.status === interface_1.GameStatus.Over
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Game is over or cancelled"
        );
      }
      switch (game.gameMode.modeTitle) {
        case interface_1.GameModes.IDLEP2M:
          yield change_coin_1.default.idlePlayerToMachineChangeCoin(
            game,
            body,
            user
          );
          break;
        case interface_1.GameModes.IDLEP2P:
        case interface_1.GameModes.REALP2P:
          yield change_coin_1.default.idlePlayerToPlayerChangeCoin(
            game,
            body,
            user
          );
          break;
        case interface_1.GameModes.MULTP2P:
          console.log("mvp");
          yield change_coin_1.default.multiPlayerToPlayerChangeCoin(
            game,
            body,
            user
          );
          break;
      }
      return game;
    });
  }
  borrowMoney(id, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(id);
      if (
        game.status == interface_1.GameStatus.Cancelled ||
        game.status === interface_1.GameStatus.Over
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Game is over or cancelled"
        );
      }
      switch (game.gameMode.modeTitle) {
        case interface_1.GameModes.IDLEP2M:
          console.log("pvm");
          yield borrow_money_1.default.idlePlayerToMachineBorrowMoney(
            game,
            body,
            user
          );
          break;
        case interface_1.GameModes.IDLEP2P:
        case interface_1.GameModes.REALP2P:
          console.log("pvp");
          yield borrow_money_1.default.idlePlayerToPlayerBorrowMoney(
            game,
            body,
            user
          );
          break;
        case interface_1.GameModes.MULTP2P:
          console.log("mvp");
          yield borrow_money_1.default.multiPlayerToPlayerBorrowMoney(
            game,
            body,
            user
          );
          break;
      }
      return game;
    });
  }
  passBall(gameId, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(gameId);
      return yield (0, pass_ball_1.passBall)(game, body, user);
    });
  }
  tackleBall(gameId, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(gameId);
      return yield (0, tackle_1.tacke)(game, body, user);
    });
  }
  shootBall(gameId, body, user) {
    return __awaiter(this, void 0, void 0, function* () {
      const game = yield this.get(gameId);
      return yield (0, shoot_1.shoot)(game, body, user);
    });
  }
}
exports.default = new Service();
