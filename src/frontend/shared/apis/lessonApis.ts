// @ts-nocheck
import { POST, GET, PUT, DELETE } from "./fetch";

const lessonApis = {
  // -- Public/Protected APIs --

  // Lấy danh sách bài học của 1 khóa (Chỉ hiện khung chương trình nếu chưa mua)
  // Backend: GET /api/lessons/:courseId
  getLessonsByCourse: ({ courseId }) => {
    return GET(`/lessons/${courseId}`);
  },

  // Xem chi tiết bài học (Video + Tài liệu) - Yêu cầu đã Enroll
  // Backend: GET /api/lessons/detail/:id
  getLessonDetail: ({ lessonId }) => {
    return GET(`/lessons/detail/${lessonId}`);
  },

  // -- Instructor/Admin APIs --

  // Tạo bài học mới
  // Backend: POST /api/lessons
  // data gồm: { courseId, title, content, videoUrl, resources, order, duration }
  createLesson: (data) => {
    return POST("/lessons", {
      body: data,
    });
  },

  // Cập nhật bài học
  // Backend: PUT /api/lessons/:id
  // dataToUpdate gồm: { title, videoUrl, isPublished, ... }
  updateLesson: ({ lessonId, dataToUpdate }) => {
    return PUT(`/lessons/${lessonId}`, {
      body: dataToUpdate,
    });
  },

  // Xóa bài học
  // Backend: DELETE /api/lessons/:id
  deleteLesson: ({ lessonId }) => {
    return DELETE(`/lessons/${lessonId}`);
  },

  // Cập nhật thứ tự bài học (Drag & Drop)
  // Backend: PUT /api/lessons/reorder
  // data đầu vào cần dạng: { courseId, lessonsList: [{_id: "...", order: 1}, ...] }
  reOrderLesson: (data) => {
    return PUT(`/lessons/reorder`, {
      body: data,
    });
  },
};

export default lessonApis;
