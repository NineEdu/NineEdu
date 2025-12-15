import express from "express";
import { generateQuizFromText } from "../controllers/aiController.js";
import { protect, isInstructor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-quiz", protect, isInstructor, generateQuizFromText);

export default router;
