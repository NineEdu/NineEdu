"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import lessonApis from "@/shared/apis/lessonApis";

export const useAddLesson = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; courseId: string }) => {
      return lessonApis.createLesson({
        ...data,
        content: "",
        videoUrl: "",
        resources: [],
        order: 99,
        duration: 10,
      });
    },
    onSuccess: () => {
      toast.success("Thêm bài học thành công!");
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Thêm thất bại");
    },
  });
};

export const useUpdateLesson = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      dataToUpdate,
    }: {
      lessonId: string;
      dataToUpdate: any;
    }) => {
      return lessonApis.updateLesson({ lessonId, dataToUpdate });
    },
    onSuccess: () => {
      toast.success("Đã lưu thay đổi!");
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật thất bại");
    },
  });
};

export const useDeleteLesson = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => {
      return lessonApis.deleteLesson({ lessonId });
    },
    onSuccess: () => {
      toast.success("Đã xóa bài học");
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa thất bại");
    },
  });
};
