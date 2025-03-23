import { Response } from "express";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import signToken from "../utils/signToken";

const createSendToken = (id: string, statusCode: number, res: Response) => {
  const token = signToken(id);

  const cookieOption = {
    maxAge: Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none" as "none",
    path: "/",
  };

  res.cookie("authToken", token, cookieOption);
  res.status(statusCode).json({ status: "Success" });
};

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError("Invalid empty fields", 400));

  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid credentials", 400));

  createSendToken(user._id, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError("Invalid empty fields", 400));

  const user = await User.create({ username, password });

  createSendToken(user._id, 201, res);
});

const logout = catchAsync(async (req, res, next) => {
  res.cookie("authToken", "", {
    maxAge: 5000,
    httpOnly: true,
    secure: true,
    sameSite: "none" as "none",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export { login, signup, logout };
