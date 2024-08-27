import { NextFunction, Request, RequestHandler, Response } from "express";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { img } = req.body;

    if (!img) {
      return res.status(400).json({ error: "No image provided" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(img, {
      folder: "post-images",
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to upload image" });
    } else {
      next(error); // Forward to the next error handler if headers are already sent
    }
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { img } = req.body;

    if (!img) {
      return res.status(400).json({ error: "No image provided" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(img, {
      folder: "avatars",
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to upload image" });
    } else {
      next(error); // Forward to the next error handler if headers are already sent
    }
  }
};
