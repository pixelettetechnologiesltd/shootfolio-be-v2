import mongoose, { Document, Schema } from 'mongoose';
import paginate from '../../../common/plugins/paginate';

interface ILeaderboard extends Document {
  user: mongoose.Types.ObjectId;
  gamesPlayed: number;
  wins: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

const leaderboardSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  rank: { type: Number },
});

leaderboardSchema.plugin(paginate);

leaderboardSchema.pre(['find', 'findOne'], async function (done) {
  this.populate('user');
  done();
});
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
