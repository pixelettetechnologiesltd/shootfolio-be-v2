import { GameStatus } from '../Games/entity/interface';
import Game from '../Games/entity/model';
import Leaderboard from './entity/modal';
import mongoose from 'mongoose';

class Service {
  constructor() {}
  public async updateLeaderboard() {
    const excludedGameModeId = '64f0683fb0985e73b9ecda81';

    const games = await Game.aggregate([
      {
        $match: {
          gameMode: { $ne: new mongoose.Types.ObjectId(excludedGameModeId) },
          status: GameStatus.Over,
        },
      },
      {
        $addFields: {
          rivalId: {
            $cond: {
              if: { $eq: [{ $type: '$rival' }, 'objectId'] }, // Check if 'rival' is an ObjectId
              then: '$rival', // If yes, use 'rival' as is
              else: '$rival._id', // If no, assume 'rival' is an object and use 'rival._id'
            },
          },
          challengerId: {
            $cond: {
              if: { $eq: [{ $type: '$challenger' }, 'objectId'] }, // Same check for 'challenger'
              then: '$challenger', // If yes, use 'challenger' as is
              else: '$challenger._id', // If no, use 'challenger._id'
            },
          },
        },
      },
      {
        $facet: {
          rivalStats: [
            {
              $group: {
                _id: '$rivalId',
                goalsFor: { $sum: '$rivalGoals' },
                goalsAgainst: { $sum: '$challengerGoals' },
                wins: {
                  $sum: {
                    $cond: [{ $gt: ['$rivalGoals', '$challengerGoals'] }, 1, 0],
                  },
                },
                gamesPlayed: { $sum: 1 },
              },
            },
          ],
          challengerStats: [
            {
              $group: {
                _id: '$challengerId',
                goalsFor: { $sum: '$challengerGoals' },
                goalsAgainst: { $sum: '$rivalGoals' },
                wins: {
                  $sum: {
                    $cond: [{ $gt: ['$challengerGoals', '$rivalGoals'] }, 1, 0],
                  },
                },
                gamesPlayed: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          combinedStats: {
            $concatArrays: ['$rivalStats', '$challengerStats'],
          },
        },
      },
      {
        $unwind: '$combinedStats',
      },
      {
        $group: {
          _id: '$combinedStats._id',
          gamesPlayed: { $sum: '$combinedStats.gamesPlayed' },
          wins: { $sum: '$combinedStats.wins' },
          goalsFor: { $sum: '$combinedStats.goalsFor' },
          goalsAgainst: { $sum: '$combinedStats.goalsAgainst' },
        },
      },
      {
        $addFields: {
          goalDifference: { $subtract: ['$goalsFor', '$goalsAgainst'] },
        },
      },
      {
        $match: {
          $nor: [{ wins: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 }],
        },
      },
    ]);

    console.log('Filtered games:', games);

    // Update or create leaderboard entries
    for (const entry of games) {
      console.log('entry=========', entry);
      const updatedBoard = await Leaderboard.findOneAndUpdate(
        { user: entry._id },
        {
          gamesPlayed: entry.gamesPlayed,
          wins: entry.wins,
          goalsFor: entry.goalsFor,
          goalsAgainst: entry.goalsAgainst,
          goalDifference: entry.goalDifference,
        },
        { upsert: true }
      );
    }
    const sortedLeaderboard = await Leaderboard.find({
      $or: [
        { wins: { $gt: 0 } },
        { goalsFor: { $gt: 0 } },
        { goalsAgainst: { $gt: 0 } },
        { goalDifference: { $ne: 0 } },
      ],
    }).sort({
      // wins: -1,
      goalDifference: -1,
    });

    // Assign ranks
    for (let i = 0; i < sortedLeaderboard.length; i++) {
      const current = sortedLeaderboard[i];
      current.rank = i + 1; // Rank is index + 1
      await current.save();
    }
    return sortedLeaderboard;
  }
}

export default new Service();

// updateLeaderboard()
//   .then(() => console.log('Leaderboard updated'))
//     .catch((err) => console.error(err));

//     import GameType from './Game'; // Adjust the import path to your Game model

//     async function updateLeaderboard() {
//       const leaderboardUpdates = await GameType.aggregate([
//         {
//           $match: {
//             gameMode: {
//               $ne: mongoose.Types.ObjectId('64f0683fb0985e73b9ecda81'),
//             },
//             status: 'Over',
//           },
//         },

//     }

//     updateLeaderboard();
