import ms from "ms";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User, { IUser } from "../models/users_model";

const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign({ "_id": user._id }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.ACCESS_TOKEN_EXPIRATION_MILLISECONDS)) });
  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign({ "_id": user._id, "random": random }, String(process.env.TOKEN_SECRET), { expiresIn: ms(Number(process.env.REFRESH_TOKEN_EXPIRATION_MILLISECONDS)) });
  return { accessToken, refreshToken };
}


const setTokens = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.status(200).json({
    accessToken,
    refreshToken,
    message: "logged in successfully.",
  });
};

const clearTokens = (res: Response) => {
  res.status(200).json({ message: "logged out successfully." });
};

const verifyRefreshToken = (
  refreshToken: string | undefined
): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }
        const userId = payload._id;

        try {
          const user: IUser | null = await User.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (
            !user.refreshTokens ||
            !user.refreshTokens.includes(refreshToken)
          ) {
            user.refreshTokens = [];
            await User.findByIdAndUpdate(user._id, {
              refreshTokens: user.refreshTokens,
            });
            reject("fail");
            return;
          }
          const tokens = user.refreshTokens!.filter(
            (token) => token !== refreshToken
          );
          user.refreshTokens = tokens;

          resolve(user);
        } catch (err) {
          reject("fail");
          return;
        }
      }
    );
  });
};

export default {
  generateTokens,
  setTokens,
  clearTokens,
  verifyRefreshToken,
};
