import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import User, {
  hashPassword,
  IUser,
  USER_RESOURCE_NAME,
} from "../models/users_model";
import token from "../middleware/auth/token";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import * as fs from "fs";
import { PathLike } from "fs";
import config from "../config/fileUploadingConfig";
import { saveFile } from "../middleware/file-storage/file-storage-middleware";
import { v4 as uuidv4 } from "uuid";

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users: IUser[] | null = await User.find();
    return res.json(users);
  } catch (err: any) {
    console.warn("Error fetching users:", err);
    return handleMongoQueryError(res, err);
  }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id }: { user_id?: string } = req.params;

  try {
    const user: IUser | null = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err: any) {
    console.warn("Error fetching user:", err);
    return handleMongoQueryError(res, err);
  }
};

const registerNewUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      username,
      email,
      password,
      avatarUrl,
    }: {
      username: string;
      email: string;
      password: string;
      avatarUrl: string;
    } = req.body;
    const user = new User({
      username,
      email,
      password,
      avatarUrl,
    });

    const savedUser: IUser = await user.save();
    return await token.returnTokens(savedUser, res, {
      message: "User registered successfully",
    });
  } catch (err: any) {
    console.warn("Error registering user:", err);
    return handleMongoQueryError(res, err, USER_RESOURCE_NAME);
  }
};

const updateUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id }: { user_id?: string } = req.params;
  const updates: Partial<IUser> = req.body;

  try {
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    if (process.env.BASE_URL && req.file?.path) {
      updates.avatarUrl = process.env.BASE_URL + req.file.path;
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.params.user_id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedUser: Partial<IUser> | null = await User.findByIdAndUpdate(
      user_id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    delete updatedUser!.password;

    return await token.returnTokens(<IUser>updatedUser, res, {
      message: "User updated successfully",
    });
  } catch (err: any) {
    console.warn("Error updating user:", err);
    return handleMongoQueryError(res, err, USER_RESOURCE_NAME);
  }
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id }: { user_id?: string } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.params.user_id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedUser: IUser | null = await User.findByIdAndDelete(user_id);
    // Delete the post image if it exists
    if (deletedUser?.avatarUrl) {
      const avatarFileName: string = deletedUser.avatarUrl.split("/").pop()!;
      const filePath: string = path.join(
        config.uploadsAvatarsDirectory,
        avatarFileName
      );
      deleteUserAvatarFromDirectory(filePath);
    }

    return res.json(deletedUser);
  } catch (err: any) {
    console.warn("Error deleting user:", err);
    return handleMongoQueryError(res, err);
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const existingUser: IUser | null = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatchedPassword) {
      return res
        .status(400)
        .json({ error: "wrong credentials. Please try again." });
    }
    return await token.returnTokens(existingUser, res, { avatarUrl: existingUser.avatarUrl });
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging in.", err });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required." });
    }

    const result = await User.updateOne(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ error: "No matching refresh token found." });
    } else {
      console.log("Refresh token successfully removed.");
    }
    return token.clearTokens(res);
  } catch (err) {
    console.warn("Error while logging out:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging out.", err });
  }
};

const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await token.verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      return res.status(400).send({ error: "Invalid refresh token" });
    }

    return await token.returnTokens(user, res);
  } catch (err: any) {
    const typedError: { status: number; message: string; extraData?: string } =
      err;
    console.warn("Error while refreshing token:", typedError.extraData);
    return res.status(typedError.status).send(typedError.message);
  }
};

const saveAvatarImage = (req: Request, res: Response): void => {
  saveFile(req, res);
};

const deleteUserAvatarFromDirectory = (filePath: PathLike): void => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
    } else {
      console.log("File deleted successfully");
    }
  });
};

const googleAuthentication = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { jwtToken }: { jwtToken: string } = req.body;
    const payload: any = jwt.decode(jwtToken);

    if (!payload) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const existingUser: IUser | null = await User.findOne({
      email: payload.email,
    });

    if (existingUser) {
      if (existingUser.username === payload.email) {
        return await token.returnTokens(existingUser, res, {
          message: "logged in with google",
        });
      } else {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
    }

    req.body = {
      username: payload.email,
      email: payload.email,
      avatarUrl: payload.picture,
      password: await hashPassword(uuidv4()),
    };

    return registerNewUser(req, res);
  } catch (err: any) {
    console.warn("Error registering user with Google:", err);
    return res.status(500).json({
      error: "An error occurred while registering user with Google.",
      err,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  registerNewUser,
  updateUserById,
  deleteUserById,
  login,
  logout,
  refresh,
  googleAuthentication,
  saveAvatarImage,
};
