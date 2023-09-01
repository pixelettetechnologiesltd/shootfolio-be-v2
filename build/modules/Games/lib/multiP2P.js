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
exports.multiPlayerToPlayerGame = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const model_1 = __importDefault(require("../../CryptoCoins/entity/model"));
const model_2 = __importDefault(require("../../GameLeagues/entity/model"));
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../Portfolio/Service"));
const interface_2 = require("../../Portfolio/entity/interface");
const model_3 = __importDefault(require("../entity/model"));
const User_model_1 = __importDefault(require("../../User/entity/User.model"));
const Admin_model_1 = __importDefault(
  require("../../Admin/entity/Admin.model")
);
const multiP2p_1 = require("../../../bull/multiP2p");
const multiPlayerToPlayerGame = (body, user, gameMode) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (body.portfolios.length !== 1) {
      throw new badRequest_error_1.BadRequestError("Select only one asset");
    }
    const leauge = yield model_2.default.findById(body.leauge);
    if (!leauge) {
      throw new badRequest_error_1.BadRequestError("Leauge not found");
    }
    if (body.gameId) {
      let decider;
      const game = yield model_3.default.findById(body.gameId);
      if (!game) {
        throw new badRequest_error_1.BadRequestError("No game found!");
      }
      if (game.status === interface_1.GameStatus.Over) {
        throw new badRequest_error_1.BadRequestError("This game is over");
      }
      if (game.rivalClub.toString() === body.club.toString()) {
        decider = "rival";
      } else {
        decider = "challenger";
      }
      if (decider === "challenger") {
        if (game.challengerProtfolios.length === 5) {
          throw new badRequest_error_1.BadRequestError("Team is already full");
        }
        if (
          game.challengerProtfolios.some(
            (e) =>
              e.portfolio.coin._id.toString() ===
              body.portfolios[0].portfolio.toString()
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Asset already taken, please select a different one!"
          );
        }
        if (
          game.challengerProtfolios.some(
            (e) => e.role === body.portfolios[0].role
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "This role has been taken!"
          );
        }
        const coin = yield model_1.default.findById(
          body.portfolios[0].portfolio
        );
        if (!coin)
          throw new badRequest_error_1.BadRequestError("Asset not found");
        if (
          coin.quote.USD.price * body.portfolios[0].quantity >
          // @ts-ignore
          leauge.investableBudget / 5
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Your balance is insufficient"
          );
        }
        const portfolio = yield Service_1.default.create({
          user: user.id,
          coin: coin._id,
          // @ts-ignore
          club: body.rivalClub ? body.rivalClub : body.challengerClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.portfolios[0].quantity,
        });
        // @ts-ignore
        game.challengerProtfolios.push({
          portfolio: portfolio.id,
          quantity: portfolio.quantity,
          user: user.id,
          balance:
            // @ts-ignore
            leauge.investableBudget / 5 -
            coin.quote.USD.price * portfolio.quantity,
          role: body.portfolios[0].role,
          ball: false,
        });
        if (!game.challenger) game.challenger = user.id;
        // @ts-ignore
        if (!game.challengerClub) game.challengerClub = body.challengerClub;
      } else {
        if (game.rivalProtfolios.length === 5) {
          throw new badRequest_error_1.BadRequestError("Team is already full");
        }
        if (
          game.rivalProtfolios.some(
            (e) =>
              e.portfolio.coin._id.toString() ===
              body.portfolios[0].portfolio.toString()
          )
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Asset already taken, please select a different one!"
          );
        }
        if (
          game.rivalProtfolios.some((e) => e.role === body.portfolios[0].role)
        ) {
          throw new badRequest_error_1.BadRequestError(
            "This role has been taken!"
          );
        }
        const coin = yield model_1.default.findById(
          body.portfolios[0].portfolio
        );
        if (!coin)
          throw new badRequest_error_1.BadRequestError("Asset not found");
        if (
          coin.quote.USD.price * body.portfolios[0].quantity >
          // @ts-ignore
          leauge.investableBudget / 5
        ) {
          throw new badRequest_error_1.BadRequestError(
            "Your balance is insufficient"
          );
        }
        const portfolio = yield Service_1.default.create({
          user: user.id,
          coin: coin._id,
          // @ts-ignore
          club: body.rivalClub ? body.rivalClub : body.challengerClub,
          playerType: interface_2.PlayerType.Real,
          quantity: body.portfolios[0].quantity,
        });
        // @ts-ignore
        game.rivalProtfolios.push({
          portfolio: portfolio.id,
          quantity: portfolio.quantity,
          user: user.id,
          balance:
            // @ts-ignore
            leauge.investableBudget / 5 -
            coin.quote.USD.price * portfolio.quantity,
          role: body.portfolios[0].role,
          ball: false,
        });
        if (!game.challenger) game.challenger = user.id;
        // @ts-ignore
        if (!game.challengerClub) game.challengerClub = body.club;
      }
      yield model_3.default.populate(game, {
        path: "challengerProtfolios.portfolio",
      });
      yield model_3.default.populate(game, {
        path: "challengerProtfolios.portfolio.user",
      });
      yield model_3.default.populate(game, {
        path: "rivalProtfolios.portfolio",
      });
      yield model_3.default.populate(game, {
        path: "rivalProtfolios.portfolio.user",
      });
      // await Game.populate(game, { path: "rival" });
      let populateRival;
      populateRival = yield User_model_1.default.findById(game.rival);
      if (populateRival) {
        // @ts-ignore
        game.rival = populateRival;
      }
      yield model_3.default.populate(game, { path: "challenger" });
      // realTimePlayerToPlayerGameScheduler(game.id);
      if (
        game.rivalProtfolios.length === 5 &&
        game.challengerProtfolios.length === 5
      ) {
        // Lets start the fucking game
        // @ts-ignore
        let challengerBalance = game.challengerProtfolios.reduce(
          (acc, curr) => acc + leauge.investableBudget / 5 - curr.balance,
          0
        );
        let rivalBalance = game.rivalProtfolios.reduce(
          (acc, curr) => acc + leauge.investableBudget / 5 - curr.balance,
          0
        );
        game.challengerBalance = challengerBalance;
        game.rivalBalance = rivalBalance;
        game.status = interface_1.GameStatus.Play;
        if (challengerBalance > rivalBalance) {
          const index = game.challengerProtfolios.findIndex(
            (e) => e.role !== interface_1.PlayerRoles.GK
          );
          game.challengerProtfolios[index].ball = true;
        } else {
          const index = game.rivalProtfolios.findIndex(
            (e) => e.role !== interface_1.PlayerRoles.GK
          );
          game.rivalProtfolios[index].ball = true;
        }
        (0, multiP2p_1.multiPlayerToPlayerGameScheduler)(game.id);
      }
      return yield game.save();
    } else {
      const coin = yield model_1.default.findById(body.portfolios[0].portfolio);
      if (!coin)
        throw new badRequest_error_1.BadRequestError("Asset not found");
      if (
        coin.quote.USD.price * body.portfolios[0].quantity >
        leauge.investableBudget / 5
      ) {
        throw new badRequest_error_1.BadRequestError(
          "Your balance is insufficient"
        );
      }
      const portfolio = yield Service_1.default.create({
        user: user.id,
        coin: coin._id,
        // @ts-ignore
        club: body.rivalClub ? body.rivalClub : body.challengerClub,
        playerType: interface_2.PlayerType.Real,
        quantity: body.portfolios[0].quantity,
      });
      // create portfolios
      const rivalPortfolios = [
        {
          portfolio: portfolio.id,
          quantity: portfolio.quantity,
          user: user.id,
          balance:
            leauge.investableBudget / 5 -
            coin.quote.USD.price * portfolio.quantity,
          role: body.portfolios[0].role,
        },
      ];
      const game = yield model_3.default.create({
        rival: user.id,
        challenger: null,
        rivalClub: body.club,
        challengerClub: null,
        rivalProtfolios: rivalPortfolios,
        challengerProtfolios: [],
        rivalBalance: 0,
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
      yield model_3.default.populate(game, { path: "rivalProtfolios.user" });
      return game.save();
    }
  });
exports.multiPlayerToPlayerGame = multiPlayerToPlayerGame;
