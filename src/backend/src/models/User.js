import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://via.placeholder.com/150" },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

// Middleware: Mã hóa mật khẩu
userSchema.pre("save", async function () {
  // 1. Nếu password không bị thay đổi, bỏ qua (return luôn, không cần next)
  if (!this.isModified("password")) {
    return;
  }

  // 2. Quan trọng: Với user đăng nhập bằng Google (Firebase), password có thể không có
  // Nếu không có password, bỏ qua việc hash
  if (!this.password) {
    return;
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: Kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
