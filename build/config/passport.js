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
const Admin_model_1 = __importDefault(require("../modules/Admin/entity/Admin.model"));
const User_model_1 = __importDefault(require("../modules/User/entity/User.model"));
const config_1 = __importDefault(require("./config"));
const tokenTypes_1 = __importDefault(require("./tokenTypes"));
var JwtStrategy = require("passport-jwt").Strategy, ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtOptions = {
    secretOrKey: config_1.default.jwtScret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload.type !== tokenTypes_1.default.ACCESS) {
            throw new Error("Invalid token type");
        }
        const user = yield User_model_1.default.findById(payload.sub);
        if (user)
            return done(null, user);
        const admin = yield Admin_model_1.default.findById(payload.sub);
        if (admin)
            return done(null, admin);
        return done(null, false);
    }
    catch (error) {
        done(error, false);
    }
});
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
exports.default = jwtStrategy;
