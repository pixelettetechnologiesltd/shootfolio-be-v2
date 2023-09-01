import { TokenTypes } from "./entity/token.interface";
import jwt from "jsonwebtoken";
import Token from "./entity/Token.model";
import config from "../../config/config";
import { UserDoc } from "../User/entity/user.interface";
import { AdminDoc } from "../Admin/entity/admin.interface";

class TokenService {
  constructor() {}

  createJwtToken({
    userId,
    expiresIn,
    type,
    secret,
  }: {
    userId: string;
    expiresIn: string;
    type: TokenTypes;
    secret: string;
  }): string {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      expiresIn: expiresIn,
      type,
    };

    return jwt.sign(payload, secret);
  }
  async saveToken({
    token,
    user,
    expires,
    type,
  }: {
    token: string;
    user: string;
    expires: string;
    type: TokenTypes;
  }) {
    const tokenDoc = await Token.build({
      token,
      user,
      expires,
      type,
    });

    await tokenDoc.save();
    return tokenDoc;
  }

  async generateAuthTokens(user: UserDoc | AdminDoc) {
    let accessTokenExpires;
    let refreshTokenExpires;
    accessTokenExpires = config.jwtExpirationAccess;
    refreshTokenExpires = config.jwtExpirationRefresh;

    const accessToken = this.createJwtToken({
      userId: user.id,
      expiresIn: accessTokenExpires,
      type: TokenTypes.access,
      secret: config.jwtScret,
    });

    const refreshToken = this.createJwtToken({
      userId: user.id,
      expiresIn: refreshTokenExpires,
      type: TokenTypes.refresh,
      secret: config.jwtScret,
    });

    await this.saveToken({
      token: refreshToken,
      user: user.id,
      expires: refreshTokenExpires,
      type: TokenTypes.refresh,
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
  }
  async verifyToken(token: string, type: TokenTypes) {
    const payload = jwt.verify(token, config.jwtScret);
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
  }
}

export default new TokenService();
