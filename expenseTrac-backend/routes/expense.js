import express from "express";
import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createExp, deleteExp, getExp, updateExp } from "../controllers/expense.controller.js";

const router = Router()

router.route('/').get(authMiddleware, getExp).post(authMiddleware, createExp)
router.route('/:id').put(authMiddleware, updateExp).delete(authMiddleware, deleteExp)

export default router;