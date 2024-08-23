import { Router } from "express";
import { uploadImage } from "../handlers/upload";

const express = require("express");
const router: Router = express.Router();

router.post("/post", uploadImage);

module.exports = router;
