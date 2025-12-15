import mongoose from "mongoose";
const quizSchema = mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Lesson",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Optional: để query cho nhanh
    },
    title: { type: String, required: true },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String }], // Mảng các đáp án A, B, C, D
        correctAnswer: { type: String, required: true },
        explanation: { type: String }, // Giải thích
      },
    ],
    passingScore: { type: Number, default: 5 }, // Điểm qua môn
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
