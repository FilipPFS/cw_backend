import { RequestHandler, Router } from "express";
import {
  createEvent,
  deleteMyEvent,
  getEvents,
  getUserEvents,
  subToEvent,
} from "../handlers/event";
import authMiddleware from "../middlewares/auth";

const express = require("express");
const router: Router = express.Router();

router.post("/", authMiddleware, createEvent as unknown as RequestHandler);
router.post(
  "/like/:eventId",
  authMiddleware,
  subToEvent as unknown as RequestHandler
);
router.get("/", authMiddleware, getEvents as unknown as RequestHandler);
router.get(
  "/session",
  authMiddleware,
  getUserEvents as unknown as RequestHandler
);
router.delete(
  "/:eventId",
  authMiddleware,
  deleteMyEvent as unknown as RequestHandler
);

module.exports = router;
