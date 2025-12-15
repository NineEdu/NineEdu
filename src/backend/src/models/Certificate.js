import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    certificateCode: { type: String, unique: true, required: true }, // Mã định danh (VD: CERT-12345)
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
