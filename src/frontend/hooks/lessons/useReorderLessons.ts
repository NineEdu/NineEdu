"use client";

import { notifyError, notifySuccess } from "@/components/Notify";
import lessonApis from "@/shared/apis/lessonApis";
import { useMutation } from "@tanstack/react-query";

type ReorderPayload = {
  courseId: string;
  lessonsList: { _id: string; order: number }[];
};

const mutationFn = async (data: ReorderPayload) => {
  return await lessonApis.reOrderLesson(data);
};

//@ts-ignore
const useReorderLessons = (mutationOptions?: any) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const reorderLessons = async ({ courseId, lessonsList }: ReorderPayload) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({
        courseId,
        lessonsList,
      });

      notifySuccess("Lesson order updated successfully");

      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { reorderLessons, ...mutation };
};

export default useReorderLessons;
