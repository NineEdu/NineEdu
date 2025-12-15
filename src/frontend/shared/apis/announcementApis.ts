// @ts-nocheck
import { GET, POST } from "./fetch";

const announcementApis = {
  // Lấy danh sách thông báo
  // Endpoint: /api/dashboard/:courseId/announcements
  getAnnouncements: ({ courseId }) => {
    return GET(`/dashboard/${courseId}/announcements`);
  },

  // Tạo thông báo mới
  // Endpoint: /api/dashboard/announcements
  // Payload: { courseId, title, content }
  createAnnouncement: (data) => {
    return POST(`/dashboard/announcements`, {
      body: data,
    });
  },
};

export default announcementApis;
