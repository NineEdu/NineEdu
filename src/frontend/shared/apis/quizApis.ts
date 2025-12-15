// @ts-nocheck
import { POST, GET, PUT, DELETE } from "./fetch";

const quizApis = {
  // -- Admin/Instructor APIs --

  createQuiz: (data) => {
    return POST("/quizzes", { body: data });
  },

  // Update Quiz (Mới)
  updateQuiz: ({ quizId, data }) => {
    return PUT(`/quizzes/${quizId}`, { body: data });
  },

  // Delete Quiz (Mới)
  deleteQuiz: ({ quizId }) => {
    return DELETE(`/quizzes/${quizId}`);
  },

  // Lấy chi tiết Quiz (Mới - Dùng cho form Edit để hiện đáp án cũ)
  // Gọi vào endpoint /details/:id mà ta vừa tạo ở trên
  getQuizDetails: ({ quizId }) => {
    return GET(`/quizzes/details/${quizId}`);
  },

  // -- Student APIs --

  // Lấy đề thi theo Lesson (không có đáp án đúng - logic cũ)
  getQuizByLesson: ({ lessonId }) => {
    return GET(`/quizzes/${lessonId}`);
  },

  submitQuiz: ({ quizId, answers }) => {
    return POST("/quizzes/submit", { body: { quizId, answers } });
  },

  // text: "Tiêu đề bài học hoặc nội dung document"
  generateQuiz: (text) => {
    return POST("/ai/generate-quiz", { body: { text } });
  },
};

export default quizApis;
