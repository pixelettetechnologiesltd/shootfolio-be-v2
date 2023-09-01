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
exports.realPlayerToPlayerGame = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const model_1 = __importDefault(require("../../CryptoCoins/entity/model"));
const model_2 = __importDefault(require("../../GameLeagues/entity/model"));
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../Portfolio/Service"));
const interface_2 = require("../../Portfolio/entity/interface");
const model_3 = __importDefault(require("../entity/model"));
const RealP2p_1 = require("../../../bull/RealP2p");
const User_model_1 = __importDefault(require("../../User/entity/User.model"));
const Admin_model_1 = __importDefault(
  require("../../Admin/entity/Admin.model")
);
const realPlayerToPlayerGame = (body, user, gameMode) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const obj = {};
    for (let i = 0; i < body.portfolios.length; i++) {
      if (body.portfolios[i].toString() in obj) {
        throw new badRequest_error_1.BadRequestError(
          "Duplicate assets, please use different assets"
        );
      }
    }
    if (body.gameId) {
      const game = yield model_3.default.findById(body.gameId);
      if (!game) {
        throw new badRequest_error_1.BadRequestError("No game found!");
      }
      // @ts-ignore
      if (game.rivalClub.toString() === body.challengerClub) {
        throw new badRequest_error_1.BadRequestError(
          "You can not compete with same club!"
        );
      }
      let totalBalance = 0;
      for (let i = 0; i < body.portfolios.length; i++) {
        const coin = yield model_1.default.findById(
          body.portfolios[i].portfolio
        );
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
      // create portfolios
      const challengerPortfolios = [];
      for (let i = 0; i < body.portfolios.length; i++) {
        const portfolio = yield Service_1.default.create({
          user: user.id,
          coin: body.portfolios[i].portfolio,
          admin: null,
          // @ts-ignore
          club: body.rivalClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.portfolios[i].quantity,
        });
        yield portfolio.save();
        challengerPortfolios.push({
          portfolio: portfolio.id,
          quantity: portfolio.quantity,
        });
      }
      console.log(challengerPortfolios);
      game.challengerBalance = leauge.investableBudget - totalBalance;
      game.challenger = user.id;
      // @ts-ignore
      game.challengerProtfolios = challengerPortfolios;
      // @ts-ignore
      game.challengerClub = body.challengerClub;
      game.status = interface_1.GameStatus.Play;
      yield model_3.default.populate(game, {
        path: "challengerProtfolios.portfolio",
      });
      // await Game.populate(game, { path: "rival" });
      let populateRival;
      populateRival = yield User_model_1.default.findById(game.rival);
      if (populateRival) {
        // @ts-ignore
        game.rival = populateRival;
      } else {
        populateRival = yield Admin_model_1.default.findById(game.rival);
        // @ts-ignore
        game.rival = populateRival;
      }
      yield model_3.default.populate(game, { path: "challenger" });
      (0, RealP2p_1.realTimePlayerToPlayerGameScheduler)(game.id);
      return yield game.save();
    } else {
      let totalBalance = 0;
      for (let i = 0; i < body.portfolios.length; i++) {
        const coin = yield model_1.default.findById(
          body.portfolios[i].portfolio
        );
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
      // create portfolios
      const rivalPortfolios = [];
      for (let i = 0; i < body.portfolios.length; i++) {
        const portfolio = yield Service_1.default.create({
          user: user.id,
          coin: body.portfolios[i].portfolio,
          admin: null,
          // @ts-ignore
          club: body.rivalClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.portfolios[i].quantity,
        });
        yield portfolio.save();
        rivalPortfolios.push({
          portfolio: portfolio.id,
          quantity: portfolio.quantity,
        });
      }
      const game = yield model_3.default.create({
        rival: user.id,
        challenger: null,
        rivalClub: body.rivalClub,
        challengerClub: null,
        rivalProtfolios: rivalPortfolios,
        challengerProtfolios: [],
        rivalBalance: leauge.investableBudget - totalBalance,
        challengerBalance: null,
        gameMode: body.gameMode,
        leauge: body.leauge,
        type: "minutes",
        remainingCamparisons: 18,
        status: interface_1.GameStatus.Pending,
      });
      // await Game.populate(game, { path: "rival" });
      let populateRival;
      populateRival = yield User_model_1.default.findById(game.rival);
      if (populateRival) {
        // @ts-ignore
        game.rival = populateRival;
      } else {
        populateRival = yield Admin_model_1.default.findById(game.rival);
        // @ts-ignore
        game.rival = populateRival;
      }
      yield model_3.default.populate(game, { path: "challenger" });
      return game.save();
    }
  });
exports.realPlayerToPlayerGame = realPlayerToPlayerGame;
