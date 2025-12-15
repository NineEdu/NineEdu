import express from "express";
import {
  createQuiz,
  getQuizByLesson,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
} from "../controllers/quizController.js";
import {
  protect,
  isAdmin,
  isInstructor,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:lessonId", protect, getQuizByLesson);
router.post("/submit", protect, submitQuiz);

router.post("/", protect, isAdmin, isInstructor, createQuiz);
router.get("/details/:id", protect, isAdmin, isInstructor, getQuizById);
router.put("/:id", protect, isAdmin, isInstructor, updateQuiz);
router.delete("/:id", protect, isAdmin, isInstructor, deleteQuiz);

export default router;
