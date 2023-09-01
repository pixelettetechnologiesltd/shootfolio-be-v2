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
const token_interface_1 = require("./entity/token.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_model_1 = __importDefault(require("./entity/Token.model"));
const config_1 = __importDefault(require("../../config/config"));
class TokenService {
    constructor() { }
    createJwtToken({ userId, expiresIn, type, secret, }) {
        const payload = {
            sub: userId,
            iat: Math.floor(Date.now() / 1000),
            expiresIn: expiresIn,
            type,
        };
        return jsonwebtoken_1.default.sign(payload, secret);
    }
    saveToken({ token, user, expires, type, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDoc = yield Token_model_1.default.build({
                token,
                user,
                expires,
                type,
            });
            yield tokenDoc.save();
            return tokenDoc;
        });
    }
    generateAuthTokens(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let accessTokenExpires;
            let refreshTokenExpires;
            accessTokenExpires = config_1.default.jwtExpirationAccess;
            refreshTokenExpires = config_1.default.jwtExpirationRefresh;
            const accessToken = this.createJwtToken({
                userId: user.id,
                expiresIn: accessTokenExpires,
                type: token_interface_1.TokenTypes.access,
                secret: config_1.default.jwtScret,
            });
            const refreshToken = this.createJwtToken({
                userId: user.id,
                expiresIn: refreshTokenExpires,
                type: token_interface_1.TokenTypes.refresh,
                secret: config_1.default.jwtScret,
            });
            yield this.saveToken({
                token: refreshToken,
                user: user.id,
                expires: refreshTokenExpires,
                type: token_interface_1.TokenTypes.refresh,
            });
            return {
                access: {
                    token: accessToken,
                    expires: accessTokenExpires,
                },
                refresh: {
                    token: refreshToken,
                    expires: refreshTokenExpires,
                },
            };
        });
    }
    verifyToken(token, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtScret);
            const tokenDoc = yield Token_model_1.default.findOne({
                token,
                type,
                user: payload.sub,
                blacklisted: false,
            });
            if (!tokenDoc) {
                throw new Error("Token not found");
            }
            return tokenDoc;
        });
    }
}
exports.default = new TokenService();
