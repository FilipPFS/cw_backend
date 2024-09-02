import { Router } from "express";
import { uploadAvatar, uploadEvent, uploadImage } from "../handlers/upload";

const express = require("express");
const router: Router = express.Router();

router.post("/post", uploadImage);
router.post("/avatar", uploadAvatar);
router.post("/event", uploadEvent);

module.exports = router;
