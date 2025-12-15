import express from "express";
import {
  authWithFirebase,
  getMe,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/firebase", authWithFirebase);

router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
