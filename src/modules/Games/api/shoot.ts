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
      rivalBalance += game.rivalProtfolios[i].balance;

      rivalBalance -= game.rivalProtfolios[i].borrowAmount;
      rivalBalance += game.rivalProtfolios[i].returnAmount;
  }
  for (let i = 0; i < game.challengerProtfolios.length; i++) {
    challengerBalance +=
      game.challengerProtfolios[i].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[i].quantity;
      challengerBalance += game.challengerProtfolios[i].balance;

      challengerBalance -= game.challengerProtfolios[i].borrowAmount;
      challengerBalance += game.challengerProtfolios[i].returnAmount;
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
      throw new BadRequestError("Can't shoot a ball, Oponent tean has a strong porfolio!");
    }

    const goalKeeper = game.challengerProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );
    const goalKeeperBalance =
      (game.challengerProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[goalKeeper].quantity) + game.challengerProtfolios[goalKeeper].balance + game.challengerProtfolios[goalKeeper].returnAmount; - game.challengerProtfolios[goalKeeper].borrowAmount;

    const attackerBalance =
      (game.rivalProtfolios[possesser].portfolio.coin.quote.USD.price *
      game.rivalProtfolios[possesser].quantity) + game.rivalProtfolios[possesser].balance + game.rivalProtfolios[possesser].returnAmount; - game.rivalProtfolios[possesser].borrowAmount ;
    if (attackerBalance < goalKeeperBalance) {
      throw new BadRequestError("Goal keeper has a strong porfolio!");
    }

    const goalRivaLKeeper = game.rivalProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );

    game.rivalProtfolios[possesser].ball = false;
    game.rivalProtfolios[goalRivaLKeeper].ball = true;

    game.isRivalQuiz = false;
    game.isChallengerQuiz = true;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Rival,
      text: `${user.name} has shot the ball`,
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

    if (rivalBalance > challengerBalance) {
      throw new BadRequestError("Can't shoot a ball, Oponent team has a strong porfolio!");
    }

    const goalKeeper = game.rivalProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );
    
    const goalKeeperBalance =
      (game.rivalProtfolios[goalKeeper].portfolio.coin.quote.USD.price *
      game.rivalProtfolios[goalKeeper].quantity) + game.rivalProtfolios[goalKeeper].balance + game.rivalProtfolios[goalKeeper].returnAmount; - game.rivalProtfolios[goalKeeper].borrowAmount;;

    const attackerBalance =
      (game.challengerProtfolios[possesser].portfolio.coin.quote.USD.price *
      game.challengerProtfolios[goalKeeper].quantity) + game.challengerProtfolios[possesser].balance + game.challengerProtfolios[possesser].returnAmount; - game.challengerProtfolios[possesser].borrowAmount ;;
    if (attackerBalance < goalKeeperBalance) {
      throw new BadRequestError("Goal keeper has a strong porfolio!");
    }

    const goalChalKeeper = game.challengerProtfolios.findIndex(
      (e) => e.role === PlayerRoles.GK
    );

    game.challengerProtfolios[possesser].ball = false;
    game.challengerProtfolios[goalChalKeeper].ball = true;
    game.isRivalQuiz = true;
    game.isChallengerQuiz = false;
    GameHistoryService.create({
      game: game.id,
      user: user.id,
      player: PlayerTeam.Challenger,
      text: `${user.name} has shot the ball`,
    });
  }
  return await game.save();
};
