import { RequestHandler, Router } from "express";
import {
  addLikeToPost,
  addNewComment,
  createPost,
  getPostComments,
  getPosts,
} from "../handlers/posts";
import authMiddleware from "../middlewares/auth";

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

module.exports = router;
