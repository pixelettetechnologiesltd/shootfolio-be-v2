import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import config from '../config/config';
import passport from 'passport';
import jwtStrategy from '../config/passport';
import authLimiter from '../config/authLimiter';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { CronJob } from 'cron';
import logRequest from '../middlewares/logRequest';
import { errorHandler } from '../middlewares/error.handler';
import { MorganErrorHandler, MorganSuccessHandler } from '../config/morgan';
import { ApiNotFoundError } from '../errors/apiNotFound.error';
import { userRoute } from '../modules/User/Routes';
import { gameModeRoutes } from '../modules/GameModes/Routes';
import { gameTypesRoute } from '../modules/GameType/Routes';
import { gameLeagueRoutes } from '../modules/GameLeagues/Routes';
import { gameClubRoute } from '../modules/GameClubs/Routes';
import { adminRoute } from '../modules/Admin/Routes';
import { coinsRoute } from '../modules/CryptoCoins/Routes';
import { portfolioRoute } from '../modules/Portfolio/Routes';
import { subscriptionRoutes } from '../modules/Subscription/Routes';
import { cardRoute } from '../modules/Card/Routes';
import { gamesRoutes } from '../modules/Games/Routes';
import { quizRoutes } from '../modules/Quiz/Routes';
import { gameHistoryRoutes } from '../modules/GameHistory/Routes';
import { updateCoins } from '../common/cron-jobs/update-coins-jobs';
import { cryptoPaymentRoute } from '../modules/CryptoPayment/Routes';

class App {
  public app: express.Application;

  cronJob: CronJob;
  constructor() {
    this.app = express();
    if (config.env !== 'test') {
      this.app.use(MorganSuccessHandler);
      this.app.use(MorganErrorHandler);
    }

    // Run Cron JOB **********************
    this.cronJob = new CronJob('0 */5 * * * *', async () => {
      try {
        console.log('Running cron job');
        updateCoins();
      } catch (e) {
        console.error(e);
      }
    });

    // Start job
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
    // ***********************************
    // Set security HTTP headers
    this.app.use(helmet());

    // enable cors
    this.app.use(cors());
    this.app.options('*', cors());

    // Static files
    this.app.use(express.static('public'));
    // Jwt
    this.app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);

    // limit repeated failed requests to auth endpoints
    if (config.env === 'pod') {
      this.app.use('/v1/api/auth', authLimiter);
    }
    // Body Parserr
    this.app.use(express.json());
    this.app.use(express.urlencoded({ limit: '500mb', extended: true }));

    this.app.set('trust proxy', true);

    // To remove data using these defaults:
    this.app.use(mongoSanitize());
    // Log Requests
    if (config.env !== 'test') this.app.use(logRequest);

    this.app.use('/v1/api/auth', userRoute);
    this.app.use('/v1/api/gamemodes', gameModeRoutes);
    this.app.use('/v1/api/gametypes', gameTypesRoute);
    this.app.use('/v1/api/gameleagues', gameLeagueRoutes);
    this.app.use('/v1/api/gameclubs', gameClubRoute);
    this.app.use('/v1/api/admin', adminRoute);
    this.app.use('/v1/api/coins', coinsRoute);
    this.app.use('/v1/api/portfolio', portfolioRoute);
    this.app.use('/v1/api/subscription', subscriptionRoutes);
    this.app.use('/v1/api/card', cardRoute);
    this.app.use('/v1/api/games', gamesRoutes);
    this.app.use('/v1/api/quiz', quizRoutes);
    this.app.use('/v1/api/analytics', gameHistoryRoutes);
    this.app.use('/v1/api/cryptopayment', cryptoPaymentRoute);
    this.app.get('/', (req: Request, res: Response) => {
      res.send({ msg: 'Welcome to Shootfolio!!' });
    });

    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new ApiNotFoundError());
    });

    this.app.use(errorHandler);
  }
}
export default new App().app;
