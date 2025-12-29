import express from "express";
import { generateQuizFromText } from "../controllers/aiController.js";
import { protect, isInstructor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-quiz", protect, isInstructor,
  /* #swagger.tags = ['AI']
     #swagger.description = 'Generate quiz questions from text using AI'
     #swagger.security = [{ "bearerAuth": [] }] */
  generateQuizFromText
);

export default router;
