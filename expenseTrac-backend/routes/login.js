import express from "express";
import { postLogin } from "../controllers/login.controller.js";

const router = express.Router();

router
  .route("/login")
  .post(postLogin);
export default router;
