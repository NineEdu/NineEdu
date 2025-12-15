import mongoose from "mongoose";

const lessonSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    title: { type: String, required: true },
    content: { type: String }, // Nội dung text/html
    videoUrl: { type: String }, // Link video (Youtube/Cloudinary)
    resources: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    order: { type: Number }, // Thứ tự bài học
    duration: { type: Number, default: 0 }, // Giây
    isPublished: {
      type: Boolean,
      default: false, // Mặc định là ẩn (Draft) khi mới tạo
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
