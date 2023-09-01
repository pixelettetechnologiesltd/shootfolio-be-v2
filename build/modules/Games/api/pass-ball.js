"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passBall = void 0;
const badRequest_error_1 = require("../../../errors/badRequest.error");
const User_model_1 = __importDefault(require("../../User/entity/User.model"));
const interface_1 = require("../entity/interface");
const Service_1 = __importDefault(require("../../GameHistory/Service"));
const interface_2 = require("../../GameHistory/entity/interface");
const model_1 = __importDefault(require("../entity/model"));
const passBall = function (game, body, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (game.gameMode.modeTitle !== interface_1.GameModes.MULTP2P) {
            throw new badRequest_error_1.BadRequestError("invalid game!");
        }
        if (body.player === "rival") {
            const passerIndex = game.rivalProtfolios.findIndex((e) => { var _a; return ((_a = e.user) === null || _a === void 0 ? void 0 : _a.id.toString()) === user.id.toString(); });
            const passesToIndex = game.rivalProtfolios.findIndex((e) => e.portfolio.id.toString() === body.portfolio.toString());
            if (passerIndex === -1) {
                throw new badRequest_error_1.BadRequestError("You don't possess the ball");
            }
            if (passesToIndex === -1) {
                throw new badRequest_error_1.BadRequestError("Invalid team member selected");
            }
            if (!game.rivalProtfolios[passerIndex].ball) {
                throw new badRequest_error_1.BadRequestError("You don't have the ball");
            }
            game.rivalProtfolios[passesToIndex].ball = true;
            game.rivalProtfolios[passerIndex].ball = false;
            Service_1.default.create({
                game: game.id,
                user: user.id,
                player: interface_2.PlayerTeam.Rival,
                text: `${user.name} has passess the ball to ${(_a = game.rivalProtfolios[passesToIndex].user) === null || _a === void 0 ? void 0 : _a.name}`,
            });
        }
        else {
            const passerIndex = game.challengerProtfolios.findIndex((e) => { var _a; return ((_a = e.user) === null || _a === void 0 ? void 0 : _a.id.toString()) === user.id.toString(); });
            const passesToIndex = game.challengerProtfolios.findIndex((e) => e.portfolio.id.toString() === body.portfolio.toString());
            if (passerIndex === -1 || passesToIndex === -1) {
                throw new badRequest_error_1.BadRequestError("Invalid user");
            }
            if (!game.challengerProtfolios[passerIndex].ball) {
                throw new badRequest_error_1.BadRequestError("You don't have the ball");
            }
            game.challengerProtfolios[passesToIndex].ball = true;
            game.challengerProtfolios[passerIndex].ball = true;
            Service_1.default.create({
                game: game.id,
                user: user.id,
                player: interface_2.PlayerTeam.Challenger,
                text: `${user.name} has passess the ball to ${(_b = game.challengerProtfolios[passesToIndex].user) === null || _b === void 0 ? void 0 : _b.name}`,
            });
        }
        yield game.save();
        yield model_1.default.populate(game, { path: "challengerProtfolios.portfolio" });
        yield model_1.default.populate(game, { path: "challengerProtfolios.portfolio.user" });
        yield model_1.default.populate(game, { path: "rivalProtfolios.portfolio" });
        yield model_1.default.populate(game, { path: "rivalProtfolios.portfolio.user" });
        let populateRival;
        populateRival = yield User_model_1.default.findById(game.rival);
        if (populateRival) {
            // @ts-ignore
            game.rival = populateRival;
        }
        yield model_1.default.populate(game, { path: "challenger" });
        return game;
    });
};
exports.passBall = passBall;
