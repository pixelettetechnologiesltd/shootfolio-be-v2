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
exports.idlePlayerToMachineGame = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const model_1 = __importDefault(require("../../CryptoCoins/entity/model"));
const model_2 = __importDefault(require("../../GameLeagues/entity/model"));
const model_3 = __importDefault(require("../../Portfolio/entity/model"));
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../GameClubs/Service"));
const Service_2 = __importDefault(require("../../Portfolio/Service"));
const interface_2 = require("../../Portfolio/entity/interface");
const model_4 = __importDefault(require("../entity/model"));
const idleP2m_1 = require("../../../bull/idleP2m");
const Admin_model_1 = __importDefault(
  require("../../Admin/entity/Admin.model")
);
const idlePlayerToMachineGame = (body, user, gameMode) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const obj = {};
    for (let i = 0; i < body.portfolios.length; i++) {
      if (body.portfolios[i].toString() in obj) {
        throw new badRequest_error_1.BadRequestError(
          "duplicate coins, please use different coins"
        );
      }
    }
    // check if balance matches
    const portfolios = yield model_3.default
      .find({ club: body.rivalClub })
      .limit(5);
    if (!portfolios.length) {
      throw new badRequest_error_1.BadRequestError(
        "No Machine portfolios found"
      );
    }
    let totalBalance = 0;
    for (let i = 0; i < body.portfolios.length; i++) {
      const coin = yield model_1.default.findById(body.portfolios[i].portfolio);
      if (!coin) {
        throw new badRequest_error_1.BadRequestError("Asset not found");
      }
      totalBalance += body.portfolios[i].quantity * coin.quote.USD.price;
    }
    const leauge = yield model_2.default.findById(body.leauge);
    if (!leauge) {
      throw new badRequest_error_1.BadRequestError("Leauge not found");
    }
    if (totalBalance > leauge.investableBudget) {
      throw new badRequest_error_1.BadRequestError(
        "Your balance is not enough"
      );
    }
    // find rival portfolios
    const rivalClub = yield Service_1.default.get(
      body === null || body === void 0 ? void 0 : body.rivalClub.toString()
    );
    let rival;
    const rivalPortfolios = portfolios.map((doc, index) => {
      if (index == 0) rival = doc.admin.id;
      return {
        portfolio: doc._id,
        quantity: doc.quantity,
      };
    });
    // create portfolios
    const challengerProtfolios = [];
    for (let i = 0; i < body.portfolios.length; i++) {
      const portfolio = yield Service_2.default.create({
        user: user.id,
        coin: body.portfolios[i].portfolio,
        admin: null,
        // @ts-ignore
        club: body.challengerClub,
        playerType: interface_2.PlayerType.Real,
        quantity: body.portfolios[i].quantity,
      });
      yield portfolio.save();
      challengerProtfolios.push({
        portfolio: portfolio.id,
        quantity: portfolio.quantity,
      });
    }
    const game = yield model_4.default.create({
      rival: rival,
      challenger: user.id,
      rivalClub: body.rivalClub,
      challengerClub: body.challengerClub,
      rivalProtfolios: rivalPortfolios,
      challengerProtfolios: challengerProtfolios,
      rivalBalance: 0,
      challengerBalance: leauge.investableBudget - totalBalance,
      gameMode: body.gameMode,
      leauge: body.leauge,
      type: "days",
      remainingCamparisons: 7,
      status: interface_1.GameStatus.Play,
    });
    (0, idleP2m_1.idelPlayerToMachineGameScheduler)(game.id);
    yield model_4.default.populate(game, { path: "rivalProtfolios.portfolio" });
    yield model_4.default.populate(game, {
      path: "challengerProtfolios.portfolio",
    });
    // await Game.populate(game, { path: "rival" });
    yield model_4.default.populate(game, { path: "challenger" });
    let x;
    x = yield Admin_model_1.default.findById(game.rival);
    // @ts-ignore
    game.rival = user;
    return game.save();
  });
exports.idlePlayerToMachineGame = idlePlayerToMachineGame;
