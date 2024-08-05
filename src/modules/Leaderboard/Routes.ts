import express from 'express';
import Controller from './Controller';
import { AsyncHandler } from '../../utils/AsyncHandler';

const router = express.Router();

router.get('/', AsyncHandler(Controller.updateLeaderboard));

export { router as leaderboardRoutes };
