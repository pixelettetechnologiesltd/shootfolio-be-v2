import { BadRequestError } from "../../../errors/badRequest.error";
import User from "../../User/entity/User.model";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, GameModes, PassBallAttrs } from "../entity/interface";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";
import Game from "../entity/model";

export const passBall = async function (
  game: GameDoc,
  body: PassBallAttrs,
  user: UserDoc
): Promise<GameDoc> {
  if (game.gameMode.modeTitle !== GameModes.MULTP2P) {
    throw new BadRequestError("invalid game!");
  }
  if (body.player === "rival") {
    const passerIndex = game.rivalProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    const passesToIndex = game.rivalProtfolios.findIndex(
      (e) => e.portfolio.id.toString() === body.portfolio.toString()
    );
    if (passerIndex === -1) {
      throw new BadRequestError("You don't possess the ball");
    }
    if (passesToIndex === -1) {
      throw new BadRequestError("Invalid team member selected");
    }
    if (!game.rivalProtfolios[passerIndex].ball) {
      throw new BadRequestError("You don't have the ball");
    }
    game.rivalProtfolios[passesToIndex].ball = true;
    game.rivalProtfolios[passerIndex].ball = false;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Rival,
      text: `${user.name} has passed the ball to ${game.rivalProtfolios[passesToIndex].user?.name}`,
    });
  } else {
    const passerIndex = game.challengerProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    const passesToIndex = game.challengerProtfolios.findIndex(
      (e) => e.portfolio.id.toString() === body.portfolio.toString()
    );

    if (passerIndex === -1 || passesToIndex === -1) {
      throw new BadRequestError("Invalid user");
    }
    if (!game.challengerProtfolios[passerIndex].ball) {
      throw new BadRequestError("You don't have the ball");
    }
    game.challengerProtfolios[passesToIndex].ball = true;
    game.challengerProtfolios[passerIndex].ball = false;

    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has passed the ball to ${game.challengerProtfolios[passesToIndex].user?.name}`,
    });
  }
  await game.save();
  await Game.populate(game, { path: "challengerProtfolios.portfolio" });
  await Game.populate(game, { path: "challengerProtfolios.portfolio.user" });
  await Game.populate(game, { path: "rivalProtfolios.portfolio" });
  await Game.populate(game, { path: "rivalProtfolios.portfolio.user" });
  let populateRival;
  populateRival = await User.findById(game.rival);
  if (populateRival) {
    // @ts-ignore
    game.rival = populateRival;
  }
  await Game.populate(game, { path: "challenger" });
  return game;
};
