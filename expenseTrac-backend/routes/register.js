import express from "express";
import { postReg } from "../controllers/register.controller.js";

const router = express.Router();

router
  .route("/register")
  .post(postReg);

export default router;
