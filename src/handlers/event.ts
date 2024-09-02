import { NextFunction, Response, Request } from "express";
import Event from "../models/Event";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, coverImg } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Event needs to have a title",
      });
    }

    const event = new Event({
      hostId: req.auth.userId,
      title,
      description,
      coverImg,
      createdAt: Date.now(),
    });

    await event.save();

    const events = await Event.find();

    res.status(201).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getUserEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEvents = await Event.find({ hostId: req.auth.userId });

    res.status(200).json(userEvents);
  } catch (error) {
    next(error);
  }
};

export const deleteMyEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const myEvent = await Event.findById(eventId);

    if (myEvent?.hostId !== req.auth.userId) {
      res.status(403).json({ message: "Not authorized." });
    }

    await Event.findByIdAndDelete(eventId);

    const updatedEvents = await Event.find();

    res.status(200).json(updatedEvents);
  } catch (error) {
    next(error);
  }
};
