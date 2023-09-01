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
exports.fetchCoins = void 0;
const axios_1 = __importDefault(require("axios"));
// import rateLimit from "axios-rate-limit";
const config_1 = __importDefault(require("../../config/config"));
const logger_1 = require("../../config/logger");
const model_1 = __importDefault(require("../../modules/CryptoCoins/entity/model"));
const fetchCoins = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // check if coins already exists
        if ((yield model_1.default.countDocuments()) > 0) {
            logger_1.Logger.info("Coins already added");
            return;
        }
        // const http = rateLimit(axios.create(), {
        //   maxRequests: 1,
        //   perMilliseconds: 50000,
        //   maxRPS: 1,
        // });
        // http.getMaxRPS();
        const data = yield axios_1.default
            .get(`${config_1.default.crypto.latestUrl}?cryptocurrency_type=coins&sort=date_added&sort_dir=asc&limit=200`, {
            headers: {
                "X-CMC_PRO_API_KEY": config_1.default.crypto.key,
            },
        })
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            // Handle successful response
            console.log("here");
            const cryptoData = data.data.data;
            for (var i = 0; i < cryptoData.length; i++) {
                cryptoData[i].photoPath = `https://s2.coinmarketcap.com/static/img/coins/64x64/${cryptoData[i].id}.png`;
            }
            //   const insertData: CoinsDoc[] = [];
            yield model_1.default.insertMany(cryptoData);
            logger_1.Logger.info("Successfully Added Crypto Data");
        }))
            .catch((error) => {
            var _a;
            if (axios_1.default.isAxiosError(error)) {
                // AxiosError-specific handling
                console.error("Axios Error:", error.message);
                console.error("HTTP Status:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.status);
            }
            else {
                // Handle other errors (e.g., network errors)
                console.error("Network Error:", error);
            }
        });
        return;
    });
};
exports.fetchCoins = fetchCoins;
