import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // Link ảnh bìa
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Liên kết sang bảng User
    },
    price: { type: Number, default: 0 },
    category: { type: String, required: true },
    tags: [String], // Mảng các string tag
    level: { type: String, default: "Beginner" },
    isPublished: { type: Boolean, default: false },
    totalLessons: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Course = mongoose.model("Course", courseSchema);

export default Course;
