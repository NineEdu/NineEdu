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

router.get("/:lessonId", protect,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Get quiz for a lesson'
     #swagger.security = [{ "bearerAuth": [] }] */
  getQuizByLesson
);

router.post("/submit", protect,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Submit quiz answers'
     #swagger.security = [{ "bearerAuth": [] }] */
  submitQuiz
);

router.post("/", protect, isAdmin, isInstructor,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Create a new quiz'
     #swagger.security = [{ "bearerAuth": [] }] */
  createQuiz
);

router.get("/details/:id", protect, isAdmin, isInstructor,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Get quiz details by ID'
     #swagger.security = [{ "bearerAuth": [] }] */
  getQuizById
);

router.put("/:id", protect, isAdmin, isInstructor,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Update a quiz'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateQuiz
);

router.delete("/:id", protect, isAdmin, isInstructor,
  /* #swagger.tags = ['Quizzes']
     #swagger.description = 'Delete a quiz'
     #swagger.security = [{ "bearerAuth": [] }] */
  deleteQuiz
);

export default router;
