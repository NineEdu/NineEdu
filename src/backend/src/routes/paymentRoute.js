import express from "express";
import {
  createPaymentUrl,
  vnpayReturn,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create_payment_url", protect,
  /* #swagger.tags = ['Payment']
     #swagger.description = 'Create VNPay payment URL'
     #swagger.security = [{ "bearerAuth": [] }] */
  createPaymentUrl
);

router.get("/vnpay_return",
  /* #swagger.tags = ['Payment']
     #swagger.description = 'VNPay payment return callback' */
  vnpayReturn
);

export default router;
