import { RequestHandler, Router } from "express";
import {
  createEvent,
  deleteMyEvent,
  getEvents,
  getUserEvent,
} from "../handlers/event";
import authMiddleware from "../middlewares/auth";

const express = require("express");
const router: Router = express.Router();

router.post("/", authMiddleware, createEvent as unknown as RequestHandler);
router.get("/", getEvents);
router.get(
  "/session",
  authMiddleware,
  getUserEvent as unknown as RequestHandler
);
router.delete(
  "/:eventId",
  authMiddleware,
  deleteMyEvent as unknown as RequestHandler
);

module.exports = router;
