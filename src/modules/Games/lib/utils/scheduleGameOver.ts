import { gameExpiryQueue } from '../../../../bull/conf';
import { GameStatus } from '../../entity/interface';
import Game from '../../entity/model';

export async function scheduleGameOver(gameId: string, duration: number) {
  try {
    console.log('gameId====', gameId, duration);
    const jobOptions = {
      delay: duration,
    };
    console.log('duration====', duration);
    await gameExpiryQueue.add({ gameId }, jobOptions);
    console.log('gameExpiryQueue====', gameExpiryQueue);
  } catch (err) {
    console.error('Error while scheduling game over:', err);
  }
}

export async function endGame(jobData: any) {
  console.log('jobData====', jobData);

  const { gameId } = jobData;
  const game = await Game.findById(gameId);

  if (game) {
    console.log('game time over====');
    game.status = GameStatus.Over;
    await game.save();
  }
}
