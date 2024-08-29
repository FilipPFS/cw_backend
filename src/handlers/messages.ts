import { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import Message from "../models/Message";

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.auth.userId;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "There is no content in your message" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
    });

    await newMessage.save();

    const chat = await Message.find({
      $or: [
        { receiverId: receiverId, senderId: senderId },
        { receiverId: senderId, senderId: receiverId },
      ],
    });

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const sessionUserId = req.auth.userId;

    const chat = await Message.find({
      $or: [
        { receiverId: userId, senderId: sessionUserId },
        { receiverId: sessionUserId, senderId: userId },
      ],
    });

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};
