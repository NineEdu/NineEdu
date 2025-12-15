import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "VNPAY", // MOMO, STRIPE, BANK_TRANSFER...
    },
    transactionCode: {
      type: String, // Mã giao dịch từ VNPAY gửi về (vnp_TransactionNo)
      required: true,
    },
    bankCode: {
      type: String, // Ngân hàng thanh toán (NCB, VCB...)
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "success",
    },
    message: { type: String }, // Ghi chú nếu lỗi
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
