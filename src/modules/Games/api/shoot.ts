import { BadRequestError } from "../../../errors/badRequest.error";
import { UserDoc } from "../../User/entity/user.interface";
import { GameDoc, GameStatus, PlayerRoles } from "../entity/interface";
import GameHistoryService from "../../GameHistory/Service";
import { PlayerTeam } from "../../GameHistory/entity/interface";
export const shoot = async function (
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
    const possesser = game.rivalProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString() && e.ball == true
    );
    if (possesser === -1) {
      throw new BadRequestError("Invalid user to shoot the ball");
    }

    if (game.rivalProtfolios[possesser].role === PlayerRoles.GK) {
      throw new BadRequestError("Goalkeeper can't shoot the ball");
    }

    if (rivalBalance < challengerBalance) {
      throw new BadRequestError("Can't shoot, weak profile!");
    }

    const goalKeeper = game.challengerProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );
    const goalKeeperBalance =
      game.challengerProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[goalKeeper].quantity;

    const attackerBalance =
      game.rivalProtfolios[possesser].portfolio.coin.quote.USD.price *
      game.rivalProtfolios[possesser].quantity;
    if (attackerBalance < goalKeeperBalance) {
      throw new BadRequestError("Weak profile to shoot!");
    }
    game.rivalProtfolios[possesser].ball = false;
    game.challengerProtfolios[goalKeeper].ball = true;
    game.rivalGoals += 1;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Rival,
      text: `${user.name} has shoot the ball and secure a goal`,
    });
  } else {
    const possesser = game.challengerProtfolios.findIndex(
      (e) => e.user?.id.toString() === user.id.toString() && e.ball == true
    );
    if (possesser === -1) {
      throw new BadRequestError("Invalid user to shoot the ball");
    }

    if (game.challengerProtfolios[possesser].role === PlayerRoles.GK) {
      throw new BadRequestError("Goalkeeper can't shoot the ball");
    }

    if (rivalBalance < challengerBalance) {
      throw new BadRequestError("Can't shoot, weak profile!");
    }

    const goalKeeper = game.rivalProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );
    const goalKeeperBalance =
      game.rivalProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
      game.rivalProtfolios[goalKeeper].quantity;

    const attackerBalance =
      game.challengerProtfolios[possesser].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[goalKeeper].quantity;
    if (attackerBalance < goalKeeperBalance) {
      throw new BadRequestError("Weak profile to shoot!");
    }
    game.challengerProtfolios[possesser].ball = false;
    game.rivalProtfolios[goalKeeper].ball = true;
    game.challengerGoals += 1;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has shoot the ball and secure a goal`,
    });
  }
  return await game.save();
};
