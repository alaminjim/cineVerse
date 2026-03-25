import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt.js";
import { envConfig } from "../config/env.js";

const accessToken = (data: JwtPayload) => {
  const token = jwtUtils.createToken(data, envConfig.ACCESS_TOKEN, {
    expiresIn: envConfig.ACCESS_TOKEN_IN,
  } as SignOptions);
  return token;
};

const refreshToken = (data: JwtPayload) => {
  const token = jwtUtils.createToken(data, envConfig.REFRESH_TOKEN, {
    expiresIn: envConfig.REFRESH_TOKEN_IN,
  } as SignOptions);
  return token;
};

export const tokenUtils = {
  accessToken,
  refreshToken,
};
