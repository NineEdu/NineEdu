import express from "express";
import { getTransactions } from "../controllers/transactionController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin,
  /* #swagger.tags = ['Transactions']
     #swagger.description = 'Get all transactions (Admin only)'
     #swagger.security = [{ "bearerAuth": [] }] */
  getTransactions
);

export default router;
