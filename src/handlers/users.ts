import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/User";
import { AuthenticatedRequest } from "./posts";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
  }
};

export const getSessionUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;

    const userData = await User.findById(sessionUserId);

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId);

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
  }
};

export const changeUserAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;
    const { img } = req.body;

    const userData = await User.findById(sessionUserId);

    if (userData) {
      userData.avatar = img;
    }

    await userData?.save();

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
  }
};

export const changeUserBanner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;
    const { img } = req.body;

    const userData = await User.findById(sessionUserId);

    if (userData) {
      userData.banner = img;
    }

    await userData?.save();

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
  }
};

export const changeUserInfos = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;
    const { firstName, lastName, description } = req.body;

    const userData = await User.findById(sessionUserId);

    if (userData) {
      (userData.firstName = firstName),
        (userData.lastName = lastName),
        (userData.description = description);
    }

    await userData?.save();

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
  }
};
