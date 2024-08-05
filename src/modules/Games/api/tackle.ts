import { BadRequestError } from "../../../errors/badRequest.error";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, GameStatus, PlayerRoles } from "../entity/interface";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";
export const tacke = async function (
  game: GameDoc,
  body: { player: string },
  user: UserDoc
) {
  if (game.status === GameStatus.Pending || game.status === GameStatus.Over) {
    throw new BadRequestError("Game is over or not started");
  }
  let rivalBalance = 0;
  let challengerBalance = 0;

  for (let i = 0; i < game.rivalProtfolios.length; i++) {
    rivalBalance +=  ( game.rivalProtfolios[i].portfolio.coin.quote.USD.price * game.rivalProtfolios[i].quantity);
    rivalBalance += game.rivalProtfolios[i].balance;
    rivalBalance -= game.rivalProtfolios[i].borrowAmount;
    rivalBalance += game.rivalProtfolios[i].returnAmount;
  }
  for (let i = 0; i < game.challengerProtfolios.length; i++) {
    challengerBalance += (game.challengerProtfolios[i].portfolio.coin.quote.USD.price * game.challengerProtfolios[i].quantity);
    challengerBalance += game.challengerProtfolios[i].balance;
    challengerBalance -= game.challengerProtfolios[i].borrowAmount;
      challengerBalance += game.challengerProtfolios[i].returnAmount;
  }

  if (body.player === "rival") {
    const index = game.rivalProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    if (index === -1) {
      throw new BadRequestError("Invalid user to tackle");
    }

    if (game.rivalProtfolios[index].role === PlayerRoles.GK) {
      throw new BadRequestError("Goalkeeper can't tackle");
    }
    if (rivalBalance < challengerBalance) {
      throw new BadRequestError("Can't tackle, weak profile!");
    }
    const posseser = game.challengerProtfolios.findIndex(
      (e) => e.ball === true
    );
    if (posseser === -1) {
      throw new BadRequestError("Ball possessor not found");
    }
    const tackler = game.rivalProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    if (tackler === -1) {
      throw new BadRequestError("Tackler not found");
    }
    game.rivalProtfolios[tackler].ball = true;
    game.challengerProtfolios[posseser].ball = false;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Rival,
      text: `${user.name} has tackled the player and got the ball`,
    });
  } else {
    const index = game.challengerProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    if (index === -1) {
      throw new BadRequestError("Invalid user to tackle");
    }

    if (game.challengerProtfolios[index].role === PlayerRoles.GK) {
      throw new BadRequestError("Goalkeeper can't tackle");
    }
    console.log("ADSSA",challengerBalance, rivalBalance);

    if (challengerBalance < rivalBalance) {
      throw new BadRequestError("You can't tackle, weak profile!");
    }
    const posseser = game.rivalProtfolios.findIndex((e) => e.ball === true);
    if (posseser === -1) {
      throw new BadRequestError("Ball possessor not found");
    }
    const tackler = game.challengerProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString()
    );
    if (tackler === -1) {
      throw new BadRequestError("Tackler not found");
    }
    game.challengerProtfolios[tackler].ball = true;
    game.rivalProtfolios[posseser].ball = false;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has tackled the player and got the ball`,
    });
  }
  return await game.save();
};
