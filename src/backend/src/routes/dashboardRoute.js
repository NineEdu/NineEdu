import express from "express";
import {
  protect,
  isInstructor,
  isAdmin,
} from "../middlewares/authMiddleware.js";
import {
  getSingleCourseStats,
  getEnrolledStudents,
  getCertificates,
  getAdminStats,
} from "../controllers/dashboardController.js";
import {
  getAnnouncements,
  createAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

router.use(protect);
router.use(isInstructor);

router.get("/:courseId/stats", getSingleCourseStats);

router.get("/:courseId/students", getEnrolledStudents);

router.get("/:courseId/certificates", getCertificates);

router.get("/:courseId/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);

router.get("/admin-stats", protect, isAdmin, getAdminStats);

export default router;
