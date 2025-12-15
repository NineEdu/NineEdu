import express from "express";
import { getTransactions } from "../controllers/transactionController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getTransactions);

export default router;
