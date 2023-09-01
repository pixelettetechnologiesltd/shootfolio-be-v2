"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const config_1 = __importDefault(require("../config/config"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../config/passport"));
const authLimiter_1 = __importDefault(require("../config/authLimiter"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("cron");
const logRequest_1 = __importDefault(require("../middlewares/logRequest"));
const error_handler_1 = require("../middlewares/error.handler");
const morgan_1 = require("../config/morgan");
const apiNotFound_error_1 = require("../errors/apiNotFound.error");
const Routes_1 = require("../modules/User/Routes");
const Routes_2 = require("../modules/GameModes/Routes");
const Routes_3 = require("../modules/GameType/Routes");
const Routes_4 = require("../modules/GameLeagues/Routes");
const Routes_5 = require("../modules/GameClubs/Routes");
const Routes_6 = require("../modules/Admin/Routes");
const Routes_7 = require("../modules/CryptoCoins/Routes");
const Routes_8 = require("../modules/Portfolio/Routes");
const Routes_9 = require("../modules/Subscription/Routes");
const Routes_10 = require("../modules/Card/Routes");
const Routes_11 = require("../modules/Games/Routes");
const Routes_12 = require("../modules/Quiz/Routes");
const Routes_13 = require("../modules/GameHistory/Routes");
const update_coins_jobs_1 = require("../common/cron-jobs/update-coins-jobs");
const Routes_14 = require("../modules/CryptoPayment/Routes");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        if (config_1.default.env !== 'test') {
            this.app.use(morgan_1.MorganSuccessHandler);
            this.app.use(morgan_1.MorganErrorHandler);
        }
        // Run Cron JOB **********************
        this.cronJob = new cron_1.CronJob('0 */5 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Running cron job');
                (0, update_coins_jobs_1.updateCoins)();
            }
            catch (e) {
                console.error(e);
            }
        }));
        // Start job
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
        // ***********************************
        // Set security HTTP headers
        this.app.use((0, helmet_1.default)());
        // enable cors
        this.app.use((0, cors_1.default)());
        this.app.options('*', (0, cors_1.default)());
        // Static files
        this.app.use(express_1.default.static('public'));
        // Jwt
        this.app.use(passport_1.default.initialize());
        passport_1.default.use('jwt', passport_2.default);
        // limit repeated failed requests to auth endpoints
        if (config_1.default.env === 'pod') {
            this.app.use('/v1/api/auth', authLimiter_1.default);
        }
        // Body Parserr
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ limit: '500mb', extended: true }));
        this.app.set('trust proxy', true);
        // To remove data using these defaults:
        this.app.use((0, express_mongo_sanitize_1.default)());
        // Log Requests
        if (config_1.default.env !== 'test')
            this.app.use(logRequest_1.default);
        this.app.use('/v1/api/auth', Routes_1.userRoute);
        this.app.use('/v1/api/gamemodes', Routes_2.gameModeRoutes);
        this.app.use('/v1/api/gametypes', Routes_3.gameTypesRoute);
        this.app.use('/v1/api/gameleagues', Routes_4.gameLeagueRoutes);
        this.app.use('/v1/api/gameclubs', Routes_5.gameClubRoute);
        this.app.use('/v1/api/admin', Routes_6.adminRoute);
        this.app.use('/v1/api/coins', Routes_7.coinsRoute);
        this.app.use('/v1/api/portfolio', Routes_8.portfolioRoute);
        this.app.use('/v1/api/subscription', Routes_9.subscriptionRoutes);
        this.app.use('/v1/api/card', Routes_10.cardRoute);
        this.app.use('/v1/api/games', Routes_11.gamesRoutes);
        this.app.use('/v1/api/quiz', Routes_12.quizRoutes);
        this.app.use('/v1/api/analytics', Routes_13.gameHistoryRoutes);
        this.app.use('/v1/api/cryptopayment', Routes_14.cryptoPaymentRoute);
        this.app.get('/', (req, res) => {
            res.send({ msg: 'Welcome to Shootfolio!!' });
        });
        this.app.all('*', (req, res, next) => {
            next(new apiNotFound_error_1.ApiNotFoundError());
        });
        this.app.use(error_handler_1.errorHandler);
    }
}
exports.default = new App().app;
