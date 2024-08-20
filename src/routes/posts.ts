import { RequestHandler, Router } from "express";
import { createPost, getPosts } from "../handlers/posts";
import authMiddleware from "../middlewares/auth";

const express = require("express");
const router: Router = express.Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost as unknown as RequestHandler);

module.exports = router;
