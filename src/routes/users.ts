import { RequestHandler, Router } from "express";
import { getSessionUser, getSingleUser, getUsers } from "../handlers/users";
import authMiddleware from "../middlewares/auth";

const express = require("express");
const router: Router = express.Router();

router.get("/", getUsers);
router.get(
  "/session",
  authMiddleware,
  getSessionUser as unknown as RequestHandler
);
router.get("/:userId", getSingleUser);

module.exports = router;
