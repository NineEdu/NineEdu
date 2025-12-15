import express from "express";
import {
  joinCourse,
  getMyCourses,
  completeLesson,
  checkEnrollment,
} from "../controllers/enrollmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/join", protect, joinCourse);
router.get("/my-courses", protect, getMyCourses);
router.post("/complete-lesson", protect, completeLesson);
router.get("/check/:courseId", protect, checkEnrollment);

export default router;
