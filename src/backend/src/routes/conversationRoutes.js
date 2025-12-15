import express from "express";
import {
  createConversation,
  getConversations,
  addReply,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createConversation);

router.get("/:courseId", protect, getConversations);

router.post("/:id/reply", protect, addReply);

router.delete("/:id", protect, deleteConversation);

export default router;
