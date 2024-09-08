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
    const { img } = req.body as { img: string };

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
    const { firstName, lastName, description } = req.body as {
      firstName: string;
      lastName: string;
      description: string;
    };

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

export const getSessionFriends = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;

    const userData = await User.findById(sessionUserId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = userData.friends || [];

    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        return await User.findById(friendId);
      })
    );

    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteFriend = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionUserId = req.auth.userId;
    const { friendId } = req.params;

    const userData = await User.findById(sessionUserId);
    const friendUser = await User.findById(friendId);

    if (!userData || !friendUser) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    userData.friends = userData.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    friendUser.friends = friendUser.friends.filter(
      (friend) => friend.toString() !== sessionUserId
    );

    await userData.save();
    await friendUser.save();

    const friends = await Promise.all(
      userData.friends.map(async (friendId) => {
        return await User.findById(friendId);
      })
    );

    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
