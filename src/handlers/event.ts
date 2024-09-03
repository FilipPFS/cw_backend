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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;

    // Fetch all events
    const events = await Event.find();

    // Split events into two arrays: those hosted by the user and those not
    const hostedEvents = events.filter((event) => event.hostId === userId);
    const otherEvents = events.filter((event) => event.hostId !== userId);

    // Combine the arrays, prioritizing the hosted events
    const sortedEvents = [...hostedEvents, ...otherEvents];

    // Send the sorted events as the response
    res.status(200).json(sortedEvents);
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

export const subToEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.hostId === req.auth.userId) {
      return res
        .status(404)
        .json({ message: "You can't sub to your own event." });
    }

    const existinSub = event.participants.find(
      (event) => event.userId === req.auth.userId
    );

    if (existinSub) {
      event.participants = event.participants.filter(
        (event) => event.userId !== req.auth.userId
      );
    } else {
      event.participants.push({ userId: req.auth.userId });
    }

    await event.save();

    const events = await Event.find();

    const hostedEvents = events.filter(
      (event) => event.hostId === req.auth.userId
    );
    const otherEvents = events.filter(
      (event) => event.hostId !== req.auth.userId
    );

    const sortedEvents = [...hostedEvents, ...otherEvents];

    res.status(200).json(sortedEvents);
  } catch (error) {
    next(error);
  }
};
