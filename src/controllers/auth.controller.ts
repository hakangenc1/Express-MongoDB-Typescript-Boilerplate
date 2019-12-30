import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/User';

export const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body || {};
  const user: IUser = new User({
    username,
    email,
    password
  });
  user.password = await user.encryptPassword(user.password);
  const savedUser = await user.save();
  const token: string = jwt.sign(
    { _id: savedUser._id },
    process.env.TOKEN_SECRET || 'tokensecret'
  );
  res.header('auth-token', token).json(savedUser);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json('Email or password is incorrect!');
  const correctPassword: boolean = await user.validatePassword(password);
  if (!correctPassword) return res.status(400).json('Password is incorrect!');
  const token: string = jwt.sign(
    { _id: user._id },
    process.env.TOKEN_SECRET || 'tokensecret',
    {
      expiresIn: 60 * 60 * 24
    }
  );
  res.header('auth-token', token).json(user);
};

export const profile = async (req: Request, res: Response) => {
  const { userId } = req;
  const user = await User.findById(userId, { password: 0 });
  if (!user) return res.status(404).json('User not found!');
  res.json(user);
};
