import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';
import { GameClubDoc } from '../../GameClubs/entity/interface';
import { UserDoc } from '../../User/entity/user.interface';
import { PortolioDoc } from '../../Portfolio/entity/interface';
import { GameModeDoc } from '../../GameModes/entity/interface';
import { GameLeagueDoc } from '../../GameLeagues/entity/interface';
import { AdminDoc } from '../../Admin/entity/admin.interface';

export enum GameModes {
  IDLEP2M = 'Idle (Player vs Machine)',
  IDLEP2P = 'Idle (Player vs Player)',
  REALP2P = 'Realtime (Player vs Player)',
  MULTP2P = 'Multiplayer Realtime (5 Player vs 5 Player)',
}
export enum PortfolioSelect {
  RivalPortfolio = 'rivalProtfolios',
  ChallengerPortfolio = 'challengerProtfolios',
}
export enum GameStatus {
  Play = 'Play',
  Over = 'Over',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
}
export enum ModeType {
  Days = 'days',
  Minute = 'Minutes',
}

export enum PlayerRoles {
  FW = 'FW',
  MD = 'MD',
  DF = 'DF',
  GK = 'GK',
  Extra = 'Extra',
}
export interface GameAttrs {
  rivalClub: mongoose.Types.ObjectId | null;
  challengerClub: mongoose.Types.ObjectId | null;
  portfolios:
    | {
        portfolio: mongoose.Types.ObjectId;
        quantity: number;
        role: string;
      }[]
    | [];
  gameMode: mongoose.Types.ObjectId;
  leauge: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId | null;
  club: mongoose.Types.ObjectId;
}

export interface GameUpdateAttrs {
  rivalClub: mongoose.Types.ObjectId;
  challengerClub: mongoose.Types.ObjectId;
  challengerProtfolios: {
    portfolio: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  gameMode: mongoose.Types.ObjectId;
}
export interface GameDoc extends mongoose.Document {
  rival: UserDoc | null;
  challenger: UserDoc | null;
  rivalClub: mongoose.Types.ObjectId;
  challengerClub: mongoose.Types.ObjectId;
  rivalProtfolios:
    | {
        portfolio: PortolioDoc;
        quantity: number;
        user: UserDoc | null;
        ball: boolean;
        balance: number;
        role: string | null;
        borrowAmount: number;
        returnAmount: number;
      }[]
    | [];
  challengerProtfolios:
    | {
        portfolio: PortolioDoc;
        quantity: number;
        user: UserDoc | null;
        ball: boolean;
        balance: number;
        role: string | null;
        borrowAmount: number;
        returnAmount: number;
      }[]
    | [];
  rivalBalance: number;
  challengerBalance: number;
  rivalPrevTeamBalance: number;
  challengerPrevTeamBalance: number;
  gameMode: GameModeDoc;
  leauge: GameLeagueDoc;
  status: GameStatus;
  rivalGoals: number;
  challengerGoals: number;
  winner: UserDoc;
  type: ModeType;
  remainingCamparisons: number;
  isRivalQuiz: boolean;
  isChallengerQuiz: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PassBallAttrs {
  portfolio: mongoose.Types.ObjectId;
  player: string;
}
export interface GameModel extends mongoose.Model<GameDoc> {
  build(attrs: GameAttrs): GameDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
