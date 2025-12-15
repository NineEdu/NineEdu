import http from "@/lib/http";
import { PaginatedResponse, PaginationParams } from "@/types/api";

// Định nghĩa Type cho Course (Lấy từ model của bạn)
export interface Course {
  _id: string;
  title: string;
  price: number;
  category: string;
  instructorId: { fullName: string; avatar: string };
  isPublished: boolean;
  createdAt: string;
}

export const courseService = {
  getAll: async (
    params: PaginationParams
  ): Promise<PaginatedResponse<Course>> => {
    return http.get("/courses", { params });
  },

  getById: async (id: string): Promise<Course> => {
    return http.get(`/courses/${id}`);
  },

  create: async (data: any): Promise<Course> => {
    return http.post("/courses", data);
  },

  update: async (id: string, data: any): Promise<Course> => {
    return http.put(`/courses/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return http.delete(`/courses/${id}`);
  },
};
