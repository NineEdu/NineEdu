"use client";

import { notifyError, notifySuccess } from "@/components/Notify";
import lessonApis from "@/shared/apis/lessonApis";
import { mutationOptions, useMutation } from "@tanstack/react-query";

const mutationFn = async ({
  courseId,
  title,
  content,
  videoUrl,
}: {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
}) => {
  return await lessonApis.createLesson({ courseId, title, content, videoUrl });
};

//@ts-ignore
const useAddLesson = (mutationOptions) => {
  const mutation = useMutation({ mutationFn, ...mutationOptions });

  const addLesson = async ({
    courseId,
    title,
    content,
    videoUrl,
  }: {
    courseId: string;
    title: string;
    content?: string;
    videoUrl?: string;
  }) => {
    try {
      //@ts-ignore
      const res = await mutation.mutateAsync({
        courseId,
        title,
        content,
        videoUrl,
      });
      notifySuccess("Lesson added successfully");
      return res;
    } catch (error) {
      notifyError(error);
      return error;
    }
  };

  return { addLesson, ...mutation };
};

export default useAddLesson;
