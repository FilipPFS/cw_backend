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
