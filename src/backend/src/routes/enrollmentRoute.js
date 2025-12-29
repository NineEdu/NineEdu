import express from "express";
import {
  joinCourse,
  getMyCourses,
  completeLesson,
  checkEnrollment,
} from "../controllers/enrollmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/join", protect,
  /* #swagger.tags = ['Enrollments']
     #swagger.description = 'Enroll in a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  joinCourse
);

router.get("/my-courses", protect,
  /* #swagger.tags = ['Enrollments']
     #swagger.description = 'Get my enrolled courses'
     #swagger.security = [{ "bearerAuth": [] }] */
  getMyCourses
);

router.post("/complete-lesson", protect,
  /* #swagger.tags = ['Enrollments']
     #swagger.description = 'Mark a lesson as completed'
     #swagger.security = [{ "bearerAuth": [] }] */
  completeLesson
);

router.get("/check/:courseId", protect,
  /* #swagger.tags = ['Enrollments']
     #swagger.description = 'Check enrollment status for a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  checkEnrollment
);

export default router;
