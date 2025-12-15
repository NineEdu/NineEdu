import Conversation from "../models/Conversation.js";
import Course from "../models/Course.js";

// create new conversation
// route: POST /api/conversations
const createConversation = async (req, res) => {
  try {
    const { courseId, lessonId, title, content } = req.body;
    const userId = req.user._id;

    if (!content || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const conversation = new Conversation({
      courseId,
      lessonId: lessonId || null,
      userId,
      title,
      content,
      replies: [],
    });

    const savedConversation = await conversation.save();

    // populate user for immediate display
    await savedConversation.populate("userId", "fullName avatar role");

    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get conversations by course id
// route: GET /api/conversations/:courseId
const getConversations = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.query; // optional filter by lessonId

    let query = { courseId };
    if (lessonId) {
      query.lessonId = lessonId;
    }

    const conversations = await Conversation.find(query)
      .populate("userId", "fullName avatar role") // thread creator info
      .populate("replies.userId", "fullName avatar role") // replier info
      .sort({ createdAt: -1 }); // newest first

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add reply
// route: POST /api/conversations/:id/reply
const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.id;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const newReply = {
      userId,
      content,
    };

    conversation.replies.push(newReply);
    await conversation.save();

    // populate for ui update
    await conversation.populate("replies.userId", "fullName avatar role");

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete conversation
// route: DELETE /api/conversations/:id
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // only owner or admin can delete
    if (
      conversation.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized to delete" });
    }

    await conversation.deleteOne();
    res.json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createConversation, getConversations, addReply, deleteConversation };
