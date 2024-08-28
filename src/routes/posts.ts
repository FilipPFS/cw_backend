import { RequestHandler, Router } from "express";
import {
  addLikeToPost,
  addNewComment,
  createPost,
  deletePost,
  getLikedPosts,
  getPostComments,
  getPosts,
  getSessionPosts,
  getUserPosts,
} from "../handlers/posts";
import authMiddleware from "../middlewares/auth";
import { getSessionUser } from "../handlers/users";

const express = require("express");
const router: Router = express.Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost as unknown as RequestHandler);
router.post(
  "/:postId",
  authMiddleware,
  addLikeToPost as unknown as RequestHandler
);
router.post(
  "/comment/:postId",
  authMiddleware,
  addNewComment as unknown as RequestHandler
);
router.get("/comment/:postId", getPostComments);
router.get(
  "/post",
  authMiddleware,
  getSessionPosts as unknown as RequestHandler
);
router.get(
  "/likedPosts",
  authMiddleware,
  getLikedPosts as unknown as RequestHandler
);
router.get("/:userId", getUserPosts);
router.delete(
  "/delete/:postId",
  authMiddleware,
  deletePost as unknown as RequestHandler
);

module.exports = router;
