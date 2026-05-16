import 'dotenv/config'
import jwt from 'jsonwebtoken'

const getJwtSecrets = () => {
  const accessTokenSecret = process.env.JWT_SECRET_KEY;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY || accessTokenSecret;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

  return { accessTokenSecret, refreshTokenSecret };
}

export const generateAccessToken = (userId: number) => {
  const { accessTokenSecret } = getJwtSecrets();

  return jwt.sign(
    { userId },
    accessTokenSecret,
    { expiresIn: "15d" }
  );
}

export const generateRefreshToken = (userId: number) => {
  const { refreshTokenSecret } = getJwtSecrets();

  return jwt.sign(
    { userId },
    refreshTokenSecret,
    { expiresIn: "300d" }
  );
}

export const generateAccessAndRefreshTokens = (userId: number) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}
