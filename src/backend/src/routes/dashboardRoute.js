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

router.get("/:courseId/stats",
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Get statistics for a specific course'
     #swagger.security = [{ "bearerAuth": [] }] */
  getSingleCourseStats
);

router.get("/:courseId/students",
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Get enrolled students for a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  getEnrolledStudents
);

router.get("/:courseId/certificates",
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Get certificates for a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  getCertificates
);

router.get("/:courseId/announcements",
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Get announcements for a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  getAnnouncements
);

router.post("/announcements",
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Create a new announcement'
     #swagger.security = [{ "bearerAuth": [] }] */
  createAnnouncement
);

router.get("/admin-stats", protect, isAdmin,
  /* #swagger.tags = ['Dashboard']
     #swagger.description = 'Get admin dashboard statistics'
     #swagger.security = [{ "bearerAuth": [] }] */
  getAdminStats
);

export default router;
