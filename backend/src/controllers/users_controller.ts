import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import User, {
  hashPassword,
  IUser,
  USER_RESOURCE_NAME,
} from "../models/users_model";
import token from "../middleware/auth/token";
import bcrypt from "bcrypt";

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
    }: { username: string; email: string; password: string } = req.body;
    const user = new User({
      username,
      email,
      password,
    });

    const savedUser: IUser = await user.save();
    return res.json(savedUser);
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

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      user_id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err: any) {
    console.warn("Error updating user:", err);
    return handleMongoQueryError(res, err, USER_RESOURCE_NAME);
  }
};

const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  const { user_id }: { user_id?: string } = req.params;

  try {
    const deletedUser: IUser | null = await User.findByIdAndDelete(user_id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
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

    const isMatchedpassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatchedpassword) {
      return res
        .status(400)
        .json({ error: "wrong credentials. Please try again." });
    }
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await token.generateTokens(existingUser);
    await addRefreshTokenToUser(existingUser, refreshToken);

    return token.setTokens(accessToken, refreshToken, res);
  } catch (err) {
    console.warn("Error while logging in:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while logging in.", err });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  try {
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
      return res.status(400).send("fail");
    }
    const { refreshToken, accessToken } = await token.generateTokens(user);

    if (!refreshToken || !accessToken) {
      return res.status(500).send("Server Error");
    }

    await addRefreshTokenToUser(user, refreshToken);

    return res.send({
      accessToken: accessToken,
      refreshToken: refreshToken,
      _id: user._id,
    });
  } catch (err) {
    return res.status(400).send("fail");
  }
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
  getAllUsers,
  getUserById,
  registerNewUser,
  updateUserById,
  deleteUserById,
  login,
  logout,
  refresh,
};
