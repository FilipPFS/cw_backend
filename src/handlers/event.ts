import { NextFunction, Response, Request } from "express";
import Event from "../models/Event";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary";

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

    if (!title || !description || !coverImg) {
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

    const hostedEvents = events.filter(
      (event) => event.hostId === req.auth.userId
    );
    const otherEvents = events.filter(
      (event) => event.hostId !== req.auth.userId
    );

    const sortedEvents = [...hostedEvents, ...otherEvents];

    res.status(201).json(sortedEvents);
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
    const events = await Event.find();

    const hostedEvents = events.filter((event) => event.hostId === userId);
    const otherEvents = events.filter((event) => event.hostId !== userId);

    const sortedEvents = [...hostedEvents, ...otherEvents];

    res.status(200).json(sortedEvents);
  } catch (error) {
    next(error);
  }
};

export const getUserEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hostedEvents = await Event.find({ hostId: req.auth.userId });

    const participantEvents = await Event.find({
      participants: { $elemMatch: { userId: req.auth.userId } },
    });

    res.status(200).json({ hostedEvents, participantEvents });
  } catch (error) {
    next(error);
  }
};

export const deleteImageFromCloudinary = async (coverImgUrl: string) => {
  const publicId = coverImgUrl.split("/").slice(-2).join("/").split(".")[0];

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deletion result:", result);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
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

    if (!myEvent) {
      return res.status(404).json("The event doesn't exist.");
    }

    if (myEvent.hostId !== req.auth.userId) {
      res.status(403).json({ message: "Not authorized." });
    }

    await deleteImageFromCloudinary(myEvent.coverImg);

    await Event.findByIdAndDelete(eventId);

    const events = await Event.find();

    const otherEvents = events.filter(
      (event) => event.hostId !== req.auth.userId
    );

    const hostedEvents = await Event.find({ hostId: req.auth.userId });

    const updatedEvents = [...hostedEvents, ...otherEvents];

    const participantEvents = await Event.find({
      participants: { $elemMatch: { userId: req.auth.userId } },
    });

    res.status(200).json({ updatedEvents, hostedEvents, participantEvents });
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

    const newHostedEvents = await Event.find({ hostId: req.auth.userId });

    const participantEvents = await Event.find({
      participants: { $elemMatch: { userId: req.auth.userId } },
    });

    res.status(200).json({ sortedEvents, newHostedEvents, participantEvents });
  } catch (error) {
    next(error);
  }
};
