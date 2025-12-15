import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    progress: { type: Number, default: 0 }, // % hoàn thành

    // Lưu danh sách ID các bài học đã hoàn thành
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    // Lưu kết quả làm bài Quiz
    quizResults: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
        score: Number,
        passed: Boolean,
        attemptedAt: { type: Date, default: Date.now },
      },
    ],

    certificateUrl: { type: String },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
