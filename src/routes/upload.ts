import { Router } from "express";
import { uploadAvatar, uploadImage } from "../handlers/upload";

const express = require("express");
const router: Router = express.Router();

router.post("/post", uploadImage);
router.post("/avatar", uploadAvatar);

module.exports = router;
