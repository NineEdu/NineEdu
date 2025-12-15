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

router.get("/", getCourses);
router.get("/manage", protect, isInstructor, getManageCourses);
router.get("/stats", protect, isInstructor, getCourseStats);

router.get("/:id", getCourseById);

router.post("/", protect, isInstructor, createCourse);
router.put("/:id", protect, isInstructor, updateCourse);
router.delete("/:id", protect, isInstructor, deleteCourse);

export default router;
