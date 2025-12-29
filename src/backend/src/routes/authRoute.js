import express from "express";
import {
  authWithFirebase,
  getMe,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Register a new user' */
  registerUser
);

router.post("/firebase",
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Authenticate with Firebase ID token' */
  authWithFirebase
);

router.post("/login",
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Login with email and password' */
  loginUser
);

router.get("/me", protect,
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Get current user profile'
     #swagger.security = [{ "bearerAuth": [] }] */
  getMe
);

export default router;
