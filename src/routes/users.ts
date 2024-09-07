import { RequestHandler, Router } from "express";
import {
  changeUserAvatar,
  changeUserBanner,
  changeUserInfos,
  deleteFriend,
  getSessionFriends,
  getSessionUser,
  getSingleUser,
  getUsers,
} from "../handlers/users";
import authMiddleware from "../middlewares/auth";
import { deletePost } from "../handlers/posts";

const express = require("express");
const router: Router = express.Router();

router.get("/", getUsers);
router.get(
  "/session",
  authMiddleware,
  getSessionUser as unknown as RequestHandler
);
router.get(
  "/friends",
  authMiddleware,
  getSessionFriends as unknown as RequestHandler
);
router.get("/:userId", getSingleUser);
router.post(
  "/avatar",
  authMiddleware,
  changeUserAvatar as unknown as RequestHandler
);
router.post(
  "/banner",
  authMiddleware,
  changeUserBanner as unknown as RequestHandler
);
router.put(
  "/delete/:friendId",
  authMiddleware,
  deleteFriend as unknown as RequestHandler
);
router.put(
  "/personal-infos",
  authMiddleware,
  changeUserInfos as unknown as RequestHandler
);

module.exports = router;
