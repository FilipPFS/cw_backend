import { RequestHandler, Router } from "express";
import { login, signup } from "../handlers/auth";
import authMiddleware from "../middlewares/auth";
import {
  deleteMessage,
  getMessages,
  getUserMessages,
  sendMessage,
} from "../handlers/messages";

const express = require("express");
const router: Router = express.Router();

router.post(
  "/new/:receiverId",
  authMiddleware,
  sendMessage as unknown as RequestHandler
);
router.get(
  "/from/:userId",
  authMiddleware,
  getMessages as unknown as RequestHandler
);
router.get("/", authMiddleware, getUserMessages as unknown as RequestHandler);
router.delete(
  "/delete/:userId/:messageId",
  authMiddleware,
  deleteMessage as unknown as RequestHandler
);

module.exports = router;
