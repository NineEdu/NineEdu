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

router.get("/public/:id",
  /* #swagger.tags = ['Users']
     #swagger.description = 'Get public user profile' */
  getPublicUserProfile
);

router.put("/profile", protect,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Update own user profile'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateUserProfile
);

router.put("/profile/password", protect,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Change password'
     #swagger.security = [{ "bearerAuth": [] }] */
  changePassword
);

router.get("/", protect, isAdmin,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Get all users (Admin only)'
     #swagger.security = [{ "bearerAuth": [] }] */
  getAllUsers
);

router.get("/:id", protect, isAdmin,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Get user by ID (Admin only)'
     #swagger.security = [{ "bearerAuth": [] }] */
  getUserById
);

router.put("/:id", protect, isAdmin,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Update user (Admin only)'
     #swagger.security = [{ "bearerAuth": [] }] */
  updateUser
);

router.delete("/:id", protect, isAdmin,
  /* #swagger.tags = ['Users']
     #swagger.description = 'Delete user (Admin only)'
     #swagger.security = [{ "bearerAuth": [] }] */
  deleteUser
);

export default router;
