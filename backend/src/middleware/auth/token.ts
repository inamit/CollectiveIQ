import jwt from "jsonwebtoken";
import { Response } from "express";
import User, { IUser } from "../../models/users_model";

const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    String(process.env.TOKEN_SECRET),
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );
  const random = Math.floor(Math.random() * 1000000).toString();
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    String(process.env.TOKEN_SECRET),
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
  return { accessToken, refreshToken };
};

const clearTokens = (res: Response) => {
  res.status(200).json({ message: "logged out successfully." });
};

const verifyRefreshToken = (
  refreshToken: string | undefined
): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    if (!refreshToken) {
      reject({status: 400, message: "Refresh token not provided"});
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject({status: 500, message: "Server error", extraData: "TOKEN_SECRET is not defined"});
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject({status: 400, message: "Invalid refresh token", extraData: err});
          return;
        }
        const userId = payload._id;

        try {
          const user: IUser | null = await User.findById(userId);
          if (!user) {
            reject({status: 400, message: "User not found", extraData: `${userId} does not exist`});
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
            reject({status: 400, message: "Invalid refresh token", extraData: `Token ${refreshToken} not found in user's refresh tokens (${user.refreshTokens})`});
            return;
          }
          const tokens = user.refreshTokens!.filter(
            (token) => token !== refreshToken
          );
          user.refreshTokens = tokens;

          resolve(user);
        } catch (err) {
          reject({status: 500, message: "Server error", extraData: err});
          return;
        }
      }
    );
  });
};

const returnTokens = async (
  user: IUser,
  res: Response<any, Record<string, any>>,
  extraData?: any
) => {
  const {
    accessToken,
    refreshToken,
  }: { accessToken: string; refreshToken: string } = await generateTokens(
    user
  );

  if (!refreshToken || !accessToken) {
    return res.status(500).send("Server Error");
  }

  await addRefreshTokenToUser(user, refreshToken);

  return res.status(200).json({
    accessToken,
    refreshToken,
    ...extraData,
  });
};

const addRefreshTokenToUser = async (
  existingUser: IUser,
  refreshToken: string
) => {
  if (!existingUser.refreshTokens) {
    existingUser.refreshTokens = [];
  }
  existingUser.refreshTokens.push(refreshToken);
  await User.findByIdAndUpdate(existingUser._id, {
    refreshTokens: existingUser.refreshTokens,
  });
};

export default {
  generateTokens,
  clearTokens,
  verifyRefreshToken,
  returnTokens,
  addRefreshTokenToUser,
};
