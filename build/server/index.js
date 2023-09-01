"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const db_init_1 = require("../database/db.init");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("../config/config"));
const http = __importStar(require("http"));
const logger_1 = require("../config/logger");
const fetchCoins_1 = require("../common/init-funcrions/fetchCoins");
class Server {
    constructor() {
        this.exitHandler = () => {
            if (this.httpServer) {
                this.httpServer.close(() => {
                    logger_1.Logger.info("Server closed");
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        };
        this.unexpectedErrorHandler = (error) => {
            logger_1.Logger.error(error);
            this.exitHandler();
        };
        this.httpServer = http.createServer(app_1.default);
    }
    __init__() {
        return __awaiter(this, void 0, void 0, function* () {
            app_1.default.listen(config_1.default.port, () => __awaiter(this, void 0, void 0, function* () {
                yield (0, db_init_1.connectDatabase)();
                console.log("Starting application on port ", config_1.default.port);
                logger_1.Logger.info("Adding coins to database");
                (0, fetchCoins_1.fetchCoins)();
            }));
        });
    }
}
const server = new Server();
server.__init__();
process.on("uncaughtException", server.unexpectedErrorHandler);
process.on("unhandledRejection", server.unexpectedErrorHandler);
process.on("SIGTERM", () => {
    logger_1.Logger.info("SIGTERM received");
    if (server) {
        server.httpServer.close();
    }
});
