// @ts-nocheck
import { POST, GET, DELETE } from "./fetch";

const conversationApis = {
  // Lấy danh sách thảo luận
  // Backend: GET /api/conversations/:courseId?lessonId=...
  getConversations: ({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId?: string;
  }) => {
    let url = `/conversations/${courseId}`;
    if (lessonId) {
      url += `?lessonId=${lessonId}`;
    }
    return GET(url);
  },

  // Tạo cuộc thảo luận mới
  // Backend: POST /api/conversations
  createConversation: ({
    courseId,
    lessonId,
    title,
    content,
  }: {
    courseId: string;
    lessonId?: string;
    title?: string;
    content: string;
  }) => {
    return POST("/conversations", {
      body: { courseId, lessonId, title, content },
    });
  },

  // Trả lời bình luận
  // Backend: POST /api/conversations/:id/reply
  replyConversation: ({
    conversationId,
    content,
  }: {
    conversationId: string;
    content: string;
  }) => {
    return POST(`/conversations/${conversationId}/reply`, {
      body: { content },
    });
  },

  // Xóa cuộc thảo luận
  // Backend: DELETE /api/conversations/:id
  deleteConversation: ({ conversationId }: { conversationId: string }) => {
    return DELETE(`/conversations/${conversationId}`);
  },
};

export default conversationApis;
