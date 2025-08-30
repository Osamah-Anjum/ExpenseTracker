import { Router } from "express";
import Expense from "../models/Expense.js";
import catchAsync from "../utils/catchAsync.js";

const router = Router();

//CREATE expense
const createExp = catchAsync(async (req, res) => {
  const { title, amount, category, date } = req.body;
  const expense = await Expense.create({
    user: req.user,
    title,
    amount,
    category,
    date,
  });
  res.status(201).json(expense);
});

const getExp = catchAsync(async (req, res) => {
  const { category, startDate, endDate } = req.query;

  let filter = { user: req.user };
  if (category) filter.category = category;
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });
  res.json(expenses);
});

const updateExp = catchAsync(async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!expense) return new AppError("Expense not found", 400);
  res.json(expense);
});

const deleteExp = catchAsync(async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });
  if (!expense) return new AppError("Expense not found", 400);
  res.json({ message: "Expense deleted" });
});

export {
  createExp,
  getExp,
  updateExp,
  deleteExp
}