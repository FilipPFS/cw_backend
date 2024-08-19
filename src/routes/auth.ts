import { Router } from "express";
import { login, signup } from "../handlers/auth";

const express = require("express");
const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
