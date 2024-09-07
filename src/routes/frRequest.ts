import { RequestHandler, Router } from "express";
import authMiddleware from "../middlewares/auth";
import {
  acceptRequest,
  checkRequest,
  getAllRequest,
  rejectRequest,
  sendRequest,
} from "../handlers/frRequest";

const express = require("express");
const router: Router = express.Router();

router.post(
  "/new/:receiverId",
  authMiddleware,
  sendRequest as unknown as RequestHandler
);
router.post(
  "/accept/:requestId",
  authMiddleware,
  acceptRequest as unknown as RequestHandler
);
router.get(
  "/session",
  authMiddleware,
  getAllRequest as unknown as RequestHandler
);
router.delete(
  "/reject/:requestId",
  authMiddleware,
  rejectRequest as unknown as RequestHandler
);
router.get(
  "/check/:userId",
  authMiddleware,
  checkRequest as unknown as RequestHandler
);

module.exports = router;
