import { NextFunction, Request, RequestHandler, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import { log } from "console";
import mongoose from "mongoose";
import { deleteImageFromCloudinary } from "./event";

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

interface postSchema {
  userId: string;
  content?: string;
  img?: string;
  createdAt: number;
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
      createdAt: Date.now(),
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;

    const allPosts = await Post.find({ userId: { $ne: userId } }).sort({
      createdAt: -1,
    });

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getFriendPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = user.friends;

    const friendPosts = await Post.find({ userId: { $in: friends } }).sort({
      createdAt: -1,
    });

    res.status(200).json(friendPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
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
    const user = await User.findById(userLikedId);

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = post.likes.find((item) => item.userId === userLikedId);

    if (existingLike) {
      post.likes = post.likes.filter((item) => item.userId !== userLikedId);
      if (user) {
        user.likedPosts = user.likedPosts.filter((item) => item !== postId);
      }
    } else {
      post.likes.push({ userId: userLikedId });
      user?.likedPosts.push(postId);
    }

    console.log("Liked posts", user?.likedPosts);

    await user?.save();
    await post.save();

    const allPosts = await Post.find();

    const likedPostIds = user!.likedPosts;

    const likedPosts = await getPostsByIds(likedPostIds);

    const userPosts = await Post.find({ userId: req.auth.userId }).sort({
      createdAt: -1,
    });

    res
      .status(201)
      .json({ posts: allPosts, liked: likedPosts, userPosts: userPosts });
  } catch (error) {
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

export const getUserPosts: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userPosts = await Post.find({ userId: userId }).sort({
      createdAt: -1,
    });

    if (userPosts) {
      res.status(200).json(userPosts);
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSessionPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("executing the function 2 times ago");

  try {
    const userId = req.auth.userId;

    const userPosts = await Post.find({ userId: userId }).sort({
      createdAt: -1,
    });

    if (userPosts) {
      res.status(200).json(userPosts);
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  } catch (err) {
    console.error(err);
  }
};

const getPostsByIds = async (postIds: string[]) => {
  // Ensure postIds are valid MongoDB ObjectIds
  const objectIds = postIds.map((id) => new mongoose.Types.ObjectId(id));

  // Fetch posts from the database
  return Post.find({ _id: { $in: objectIds } }).exec();
};

export const getLikedPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId; // Adjust according to your request object
    const user = await User.findById(userId); // Fetch the user from the database

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPostIds = user.likedPosts; // Assuming this is an array of strings (post IDs)

    if (!likedPostIds || likedPostIds.length === 0) {
      return res.status(200).json([]); // Return an empty array if no liked posts
    }

    // Get posts by IDs
    const likedPosts = await getPostsByIds(likedPostIds);

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    next(error);
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const userId = req.auth.userId;

    if (!post) {
      return res.status(403).json({ message: "This post doesn't exist." });
    }

    if (post.img) {
      await deleteImageFromCloudinary(post.img);
    }

    await Post.findByIdAndDelete(postId);

    const posts = await Post.find({ userId: userId });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
};
