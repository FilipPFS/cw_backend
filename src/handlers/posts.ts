import { NextFunction, Request, RequestHandler, Response } from "express";
import Post from "../models/Post";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

interface postSchema {
  userId: string;
  content?: string;
  img?: string;
}

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, img } = req.body;

    if (!content && !img) {
      return res.status(400).json({
        message: "Either content or image is required to make a post.",
      });
    }

    const post = new Post<postSchema>({
      userId: req.auth.userId,
      content,
      img,
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    next(error);
  }
};

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const allPosts = await Post.find();

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err);
  }
};
