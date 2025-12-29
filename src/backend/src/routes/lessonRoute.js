import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../configs/firebase.js";
import { protect, isInstructor } from "../middlewares/authMiddleware.js";
import {
  createLesson,
  getLessonDetail,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
  updateLessonOrder,
} from "../controllers/lessonController.js";

const router = express.Router();

const identifyUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next();
    }

    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token);

      const user = await User.findOne({ email: decodedFirebase.email }).select(
        "-password"
      );
      if (user) {
        req.user = user;
      } else {
      }
      return next();
    } catch (firebaseError) {}

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in env");
      }

      const decodedLocal = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedLocal.id).select("-password");
      if (user) {
        req.user = user;
      } else {
      }
      return next();
    } catch (localError) {}

    next();
  } catch (error) {
    next();
  }
};

router.get("/:courseId", identifyUser,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Get all lessons for a course' */
  getLessonsByCourse
);

router.put("/reorder", protect, isInstructor,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Reorder lessons in a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateLessonOrder
);

router.get("/detail/:id", protect,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Get lesson details by ID'
     #swagger.security = [{ "bearerAuth": [] }] */
  getLessonDetail
);

router.post("/", protect, isInstructor,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Create a new lesson'
     #swagger.security = [{ "bearerAuth": [] }] */
  createLesson
);

router.put("/:id", protect, isInstructor,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Update a lesson'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateLesson
);

router.delete("/:id", protect, isInstructor,
  /* #swagger.tags = ['Lessons']
     #swagger.description = 'Delete a lesson'
     #swagger.security = [{ "bearerAuth": [] }] */
  deleteLesson
);

export default router;
