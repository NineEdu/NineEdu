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

router.get("/:courseId", identifyUser, getLessonsByCourse);

router.put("/reorder", protect, isInstructor, updateLessonOrder);
router.get("/detail/:id", protect, getLessonDetail);
router.post("/", protect, isInstructor, createLesson);
router.put("/:id", protect, isInstructor, updateLesson);
router.delete("/:id", protect, isInstructor, deleteLesson);

export default router;
