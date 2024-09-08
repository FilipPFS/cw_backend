import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./messages";
import FrRequest from "../models/FrRequest";
import User from "../models/User";

export const sendRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = req.auth.userId;
    const { receiverId } = req.params;

    if (senderId === receiverId) {
      return res
        .status(400)
        .json("You can't send a friend request to yourself.");
    }

    const existingRequest = await FrRequest.find({
      $and: [{ senderId: senderId }, { receiverId: receiverId }],
    });

    console.log("Existing request", existingRequest);

    if (existingRequest.length > 0) {
      return res
        .status(400)
        .json({ message: "A request already exists", existingRequest });
    }

    const request = new FrRequest({
      senderId,
      receiverId,
    });

    await request.save();

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getAllRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = req.auth.userId;

    const sendedRequests = await FrRequest.find({ senderId: senderId });

    const receivedRequest = await FrRequest.find({ receiverId: senderId });

    res.status(200).json({ receivedRequest, sendedRequests });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;

    const existinRequest = await FrRequest.findById(requestId);

    if (existinRequest?.receiverId !== req.auth.userId) {
      return res.status(400).json("You can't accept this request.");
    }

    const firstUser = await User.findById(existinRequest.receiverId);
    const secondUser = await User.findById(existinRequest.senderId);

    if (firstUser && secondUser) {
      firstUser.friends.push(secondUser._id.toString());
      secondUser.friends.push(firstUser._id.toString());
      await firstUser.save();
      await secondUser.save();
    }

    await FrRequest.findByIdAndDelete(requestId);

    const userRequests = await FrRequest.find({ receiverId: firstUser?._id });

    const friendIds = firstUser?.friends || [];

    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        return await User.findById(friendId);
      })
    );

    res.status(200).json({
      message: "Friend request accepted.",
      secondUser,
      userRequests,
      friends,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;

    const existinRequest = await FrRequest.findById(requestId);

    if (existinRequest?.receiverId !== req.auth.userId) {
      return res.status(400).json("You can't reject this request.");
    }

    await FrRequest.findByIdAndDelete(requestId);

    const userRequests = await FrRequest.find({ receiverId: req.auth.userId });

    res.status(200).json({ userRequests });
  } catch (error) {
    next(error);
  }
};

export const checkRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const myRequest = await FrRequest.findOne({
      senderId: req.auth.userId,
      receiverId: userId,
    });

    const userRequest = await FrRequest.findOne({
      senderId: userId,
      receiverId: req.auth.userId,
    });

    if (!myRequest && !userRequest) {
      return res.status(400).json({ message: "Request doesn't exist." });
    }

    if (myRequest) {
      return res
        .status(200)
        .json({ sentRequest: true, friendRequest: myRequest });
    }

    if (userRequest) {
      return res
        .status(200)
        .json({ sentRequest: false, friendRequest: userRequest });
    }
  } catch (error) {
    next(error);
  }
};
