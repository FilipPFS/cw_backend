import { NextFunction, Request, RequestHandler, Response } from "express";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { img } = req.body as { img: string };

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
      next(error);
    }
  }
};

export const uploadEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { img } = req.body as { img: string };

    if (!img) {
      return res.status(400).json({ error: "No image provided" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(img, {
      folder: "event-covers",
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to upload image" });
    } else {
      next(error);
    }
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { img } = req.body as { img: string };

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
      next(error);
    }
  }
};
