import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  changePassword,
  getPublicUserProfile,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/public/:id", getPublicUserProfile);

router.put("/profile", protect, updateUserProfile);
router.put("/profile/password", protect, changePassword);

router.get("/", protect, isAdmin, getAllUsers);

router
  .route("/:id")
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

export default router;
