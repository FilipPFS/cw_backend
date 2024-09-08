import { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import Message from "../models/Message";

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

interface IMessage {
  senderId: string;
  receiverId: string;
  content: string;
  date: Date;
}

type GroupedMessages = {
  [key: string]: IMessage[];
};

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

    const newMessage = new Message<IMessage>({
      senderId,
      receiverId,
      content,
      date: new Date(),
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

export const getUserMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.auth.userId;

    const messages: IMessage[] = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ date: -1 });

    const groupedMessages: GroupedMessages = {};

    messages.forEach((message) => {
      const key = [message.senderId, message.receiverId].sort().join("_");

      if (!groupedMessages[key]) {
        groupedMessages[key] = [];
      }

      groupedMessages[key].push(message);
    });

    Object.keys(groupedMessages).forEach((key) => {
      groupedMessages[key].reverse();
    });

    res.status(200).json(groupedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { messageId } = req.params;
    const sessionId = req.auth.userId;

    const message = await Message.findById(messageId);

    if (message?.senderId !== sessionId) {
      res.status(403).json("You can't delete messages from other users.");
    } else {
      await Message.findByIdAndDelete(messageId);
    }

    const chat = await Message.find({
      $or: [
        { receiverId: userId, senderId: sessionId },
        { receiverId: sessionId, senderId: userId },
      ],
    });

    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
