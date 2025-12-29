import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getManageCourses,
  getCourseStats,
} from "../controllers/courseController.js";
import { protect, isInstructor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Get all courses' */
  getCourses
);

router.get("/manage", protect, isInstructor,
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Get courses managed by instructor'
     #swagger.security = [{ "bearerAuth": [] }] */
  getManageCourses
);

router.get("/stats", protect, isInstructor,
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Get course statistics'
     #swagger.security = [{ "bearerAuth": [] }] */
  getCourseStats
);

router.get("/:id",
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Get course by ID' */
  getCourseById
);

router.post("/", protect, isInstructor,
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Create a new course'
     #swagger.security = [{ "bearerAuth": [] }] */
  createCourse
);

router.put("/:id", protect, isInstructor,
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Update a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateCourse
);

router.delete("/:id", protect, isInstructor,
  /* #swagger.tags = ['Courses']
     #swagger.description = 'Delete a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  deleteCourse
);

export default router;
