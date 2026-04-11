import { Request, Response } from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' })
    ;
};

export const googleAuthSuccess = (req: any, res: Response) => {
  if (req.user) {
    const token = generateToken(req.user._id.toString());

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    res.redirect(`${frontendUrl}/login-success?token=${token}&id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&profileImage=${req.user.profileImage}&isAdmin=${req.user.isAdmin}`);
  } else {
    res.status(401).json({ message: "Google Authentication Failed" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = generateToken(String(user._id));

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: token,
          isAdmin: user.isAdmin,
        });
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: token,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getUsers = async (req: any, res: Response) => {
  const users = await User.find({});
  res.json(users);
};

export const makeUserSeller = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.role = 'seller';
      const updatedUser = await user.save();

      const token = generateToken(updatedUser._id.toString());

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        token: token,
        message: "Congratulations! You are now a seller."
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};