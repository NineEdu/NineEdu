import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // Tạo _id riêng cho từng reply để dễ quản lý xóa/sửa
);

const conversationSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Nếu muốn comment theo từng bài học thì gửi lessonId lên, không thì null (comment chung cho khóa)
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String, // Tiêu đề thảo luận (Optional)
    },
    content: {
      type: String,
      required: true,
    },
    replies: [replySchema], // Mảng chứa các câu trả lời
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt cho thread chính
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
