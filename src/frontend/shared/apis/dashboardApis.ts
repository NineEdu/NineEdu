// @ts-nocheck
import { GET } from "./fetch";

const dashboardApis = {
  // Lấy thống kê tổng quan (Overview Tab)
  // Endpoint: /api/dashboard/:courseId/stats
  getCourseStats: ({ courseId }) => {
    return GET(`/dashboard/${courseId}/stats`);
  },

  // Lấy danh sách học viên (Students Tab)
  // Endpoint: /api/dashboard/:courseId/students?keyword=...
  getStudents: ({ courseId, keyword }) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);

    return GET(`/dashboard/${courseId}/students?${params.toString()}`);
  },

  // Lấy danh sách chứng chỉ (Certificates Tab)
  // Endpoint: /api/dashboard/:courseId/certificates
  getCertificates: ({ courseId }) => {
    return GET(`/dashboard/${courseId}/certificates`);
  },

  getAdminStats: () => {
    return GET("/dashboard/admin-stats");
  },
};

export default dashboardApis;
