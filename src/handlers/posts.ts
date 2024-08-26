import { NextFunction, Request, RequestHandler, Response } from "express";
import Post from "../models/Post";

export interface AuthenticatedRequest extends Request {
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

export const addLikeToPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userLikedId = req.auth.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(post);

    const existingLike = post.likes.find((item) => item.userId === userLikedId);

    console.log(existingLike);

    if (existingLike) {
      post.likes = post.likes.filter((item) => item.userId !== userLikedId);
    } else {
      post.likes.push({ userId: userLikedId });
    }

    await post.save();

    const allPosts = await Post.find();

    res.status(201).json(allPosts);
  } catch (error) {
    // Pass the error to the error-handling middleware
    next(error);
  }
};

export const addNewComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);

    const { postId } = req.params;
    const userCommentId = req.auth.userId;
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ message: "There is no content in your comment." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ userId: userCommentId, text: comment });

    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    next(error);
  }
};

export const getPostComments: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const selectedPost = await Post.findById(postId);

    if (selectedPost) {
      res.status(200).json(selectedPost.comments);
    }
  } catch (err) {
    console.error(err);
  }
};
