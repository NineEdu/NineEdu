import express from "express";
import {
  createConversation,
  getConversations,
  addReply,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect,
  /* #swagger.tags = ['Conversations']
     #swagger.description = 'Create a new conversation'
     #swagger.security = [{ "bearerAuth": [] }] */
  createConversation
);

router.get("/:courseId", protect,
  /* #swagger.tags = ['Conversations']
     #swagger.description = 'Get conversations for a course'
     #swagger.security = [{ "bearerAuth": [] }] */
  getConversations
);

router.post("/:id/reply", protect,
  /* #swagger.tags = ['Conversations']
     #swagger.description = 'Add a reply to a conversation'
     #swagger.security = [{ "bearerAuth": [] }] */
  addReply
);

router.delete("/:id", protect,
  /* #swagger.tags = ['Conversations']
     #swagger.description = 'Delete a conversation'
     #swagger.security = [{ "bearerAuth": [] }] */
  deleteConversation
);

export default router;
