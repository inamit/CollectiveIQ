import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth/auth-middleware";
import { fetchUser, fetchUserDisplay,updatePassword,updateUser } from "../controller/user.controller";
import { Password, User } from "../../../models/user";

export const userRouter: Router = Router();

userRouter.get('/userData', authMiddleware, async (req, res) => {
  try {
    const userEmail: string = res.locals.authUser.email;
    console.log('Got request to get user data for', userEmail);
    res.status(200).send(await fetchUser(userEmail));
  } catch (error) {
    console.error('Error fetching user data: ', error);
    res.status(500).send({ error: (error as Error).message });
  }
})

userRouter.put('/userData', authMiddleware, async (req, res) => {
  try {
    const userEmail: string = res.locals.authUser.email;
    const user: User = req.body;
    console.log('Got request to get user data for', userEmail);
    let result = await updateUser(user);
    res.status(200).send(result);
  }
    catch (error) {
      console.error('Error fetching user data: ', error);
      res.status(500).send({ error: (error as Error).message });
    }
});

userRouter.get('/userDisplay', authMiddleware, async (req, res) => {
  try {
    const userEmail: string = req.query.email as string;
    console.log(`Got request to get user ${userEmail} data for`, userEmail);
    res.status(200).send(await fetchUserDisplay(userEmail));
  } catch (error) {
    console.error('Error fetching user data: ', error);
    res.status(500).send({ error: (error as Error).message });
  }
})

userRouter.put('/userData/password', authMiddleware, async (req, res) => {
  try {
    const userEmail: string = res.locals.authUser.email;
    const passwords: Password = req.body;
    console.log('Got request to change password data for', userEmail);
    let result = await updatePassword(userEmail,passwords.oldPassword,passwords.newPassword);
    res.status(200).send(result);
  }
    catch (error) {
      console.error('Error fetching user data: ', error);
      res.status(500).send({ error: (error as Error).message });
    }
});