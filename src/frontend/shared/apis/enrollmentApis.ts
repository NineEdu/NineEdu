// @ts-nocheck
import { POST, GET, PUT } from "./fetch";

const enrollmentApis = {
  // -- Student APIs --

  // Đăng ký tham gia khóa học
  // Backend: POST /api/enroll/join
  // body: { courseId }
  joinCourse: ({ courseId }) => {
    return POST("/enroll/join", {
      body: { courseId },
    });
  },

  // Lấy danh sách khóa học của tôi
  // Backend: GET /api/enroll/my-courses
  getMyCourses: () => {
    return GET("/enroll/my-courses");
  },

  // Check trạng thái đăng ký của 1 khóa (Optional - nếu cần check lẻ)
  // Backend: GET /api/enroll/check/:courseId (Bạn cần viết thêm API này ở BE nếu muốn dùng)
  checkEnrollmentStatus: ({ courseId }) => {
    return GET(`/enroll/check/${courseId}`);
  },

  // Hoàn thành bài học & cập nhật tiến độ
  // Backend: POST /api/enroll/complete-lesson
  // body: { courseId, lessonId }
  completeLesson: ({ courseId, lessonId }) => {
    return POST("/enroll/complete-lesson", {
      body: { courseId, lessonId },
    });
  },

  // --- PAYMENT APIs (VNPAY) ---

  // 1. Tạo URL thanh toán (Updated)
  // Backend cần: { courseId, amount }
  createPaymentUrl: ({ courseId, amount }) => {
    return POST(`/payment/create_payment_url`, {
      body: { courseId, amount },
    });
  },

  // 2. Xác thực kết quả trả về từ VNPAY (New)
  // Backend cần nhận toàn bộ query params để check chữ ký (checksum)
  vnpayReturn: (params) => {
    // Chuyển object params thành query string (vd: ?vnp_Amount=...&vnp_ResponseCode=...)
    const queryString = new URLSearchParams(params).toString();
    return GET(`/payment/vnpay_return?${queryString}`);
  },
};

export default enrollmentApis;
